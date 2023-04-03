import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CookieJar, Cookie } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import * as fs from 'fs';
import { HEADERS_INIT_CONVER } from '../constants';
import { parseProxyString } from '../utils';
import chalk from 'chalk';
export type ConversationStruct = {
  conversationId: string;
  clientId: string;
  conversationSignature: string;
  result: {
    value: string;
    message: string | null;
  };
};
export class Conversation {
  /**
   * Conversation API
   */
  struct: ConversationStruct;
  session: AxiosInstance;

  constructor(
    cookiePath: string = '',
    cookies: Record<string, string>[] | null = null,
    proxy: string | null = null,
  ) {
    this.struct = {
      conversationId: '',
      clientId: '',
      conversationSignature: '',
      result: { value: 'Success', message: null },
    };

    const clientOptions: AxiosRequestConfig = {
      proxy: proxy ? parseProxyString(proxy) : undefined,
      timeout: 30000,
      headers: HEADERS_INIT_CONVER,
    };

    this.session = wrapper(axios.create(clientOptions));

    let cookieFile: Record<string, string>[];
    if (cookies !== null) {
      cookieFile = cookies;
    } else {
      const f = cookiePath
        ? fs.readFileSync(cookiePath, 'utf8')
        : fs.readFileSync(process.env.COOKIE_FILE as string, 'utf-8');
      cookieFile = JSON.parse(f);
    }

    const cookieJar = new CookieJar();
    for (const { name, value } of cookieFile) {
      // console.log(
      //   chalk.bold(
      //     chalk.blue(`Setting cookie are: ${name}, value: {${value}}`),
      //   ),
      // );
      cookieJar.setCookieSync(
        new Cookie({ key: name, value }),
        'https://bing.com',
      );
    }

    this.session.defaults.jar = cookieJar;
    this.session.interceptors.request.use((config) => {
      config.withCredentials = true;
      config.headers.Cookie = cookieJar.getCookieStringSync('https://bing.com');
      // console.log(
      //   chalk.bold(
      //     chalk.red(
      //       `the current cookies are: ${cookieJar.getCookieStringSync(
      //         'https://bing.com',
      //       )}`,
      //     ),
      //   ),
      // );
      return config;
    });
    this.session.defaults.withCredentials = true;
  }

  async initialize() {
    // Send GET request
    let response = await this.session.get(
      process.env.BING_PROXY_URL ||
        'https://edgeservices.bing.com/edgesvc/turing/conversation/create',
    );

    if (response.status !== 200) {
      response = await this.session.get(
        'https://edge.churchless.tech/edgesvc/turing/conversation/create',
      );
    }

    if (response.status !== 200) {
      console.error(`Status code: ${response.status}`);
      console.error(response.data);
      console.error(response.config.url);
      throw new Error('Authentication failed');
    }

    try {
      this.struct = response.data;
    } catch (err) {
      throw new Error(
        'Authentication failed. You have not been accepted into the beta.',
      );
    }

    if (this.struct.result.value === 'UnauthorizedRequest') {
      throw new Error(
        `UnauthorizedRequestError message: [${
          this.struct.result.message || 'UnauthorizedRequest without message'
        },
        the used cookie: [${this.session.defaults.jar?.getCookieStringSync(
          '*',
        )}]`,
      );
    }
  }
}
