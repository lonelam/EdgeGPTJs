import { RawData, WebSocket } from 'ws';
import { Conversation } from './Conversation'; // Import the Conversation class from the previous code block
import { ChatHubRequest } from './ChatHubRequest'; // Import the ChatHubRequest class (not provided in the code)

import { ConversationStyleEnumType, DELIMITER, HEADERS } from '../constants';
import { appendIdentifier } from '../utils';
import chalk from 'chalk';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { Agent } from 'http';
import { firstValueFrom, Subject } from 'rxjs';

export class ChatHub {
  wss: WebSocket | null = null;
  request: ChatHubRequest;
  loop: boolean = false;

  constructor(conversation: Conversation, public proxy: string | null = null) {
    this.request = new ChatHubRequest(
      conversation.struct.conversationSignature,
      conversation.struct.clientId,
      conversation.struct.conversationId,
    );
  }

  async *askStream(
    prompt: string,
    wssLink: string,
    conversationStyle: ConversationStyleEnumType | null = null,
  ): AsyncGenerator<[boolean, string | Record<string, any>]> {
    if (this.wss && this.wss.readyState !== WebSocket.CLOSED) {
      this.wss.close();
    }

    this.wss = new WebSocket(wssLink, {
      headers: HEADERS, // Define the HEADERS constant
      agent: this.proxy ? (new SocksProxyAgent(this.proxy) as Agent) : false,
    });
    const currentWss = this.wss;
    // console.log('a websocket is created');
    // console.log('a websocket is open');
    await this.initialHandshake();

    this.request.update(prompt, conversationStyle);
    let final = false;
    const responsed = new Subject<[boolean, string | Record<string, any>]>();

    currentWss.on('message', (rawData: RawData) => {
      if (responsed.closed) return;
      const data = rawData.toString('utf-8');
      const objects = data.split(DELIMITER); // Define the DELIMITER constant
      for (const obj of objects) {
        if (obj === null || obj === '') {
          continue;
        }
        const response = JSON.parse(obj);
        // console.log(
        //   chalk.yellowBright('the data for debug: ', JSON.stringify(response)),
        // );
        if (response.type === 1 && response.arguments[0]?.messages) {
          const respTxt =
            response.arguments[0].messages[0].adaptiveCards[0].body[0].text;
          responsed.next([false, respTxt]);
        } else if (response.type === 2) {
          // if (response.item.result.error) {
          //   final = true;
          //   responsed.error(
          //     new Error(
          //       `the response encountered error: [${response.item.result.error}] "${response.item.result.message}"`,
          //     ),
          //   );
          //   responsed.complete();
          // } else {
          final = true;
          responsed.next([true, response]);
          responsed.complete();
          // }
        }
      }
    });
    // console.log(
    //   chalk.bold(
    //     chalk.yellow(
    //       `the sent struct is ${JSON.stringify(this.request.struct)}`,
    //     ),
    //   ),
    // );
    currentWss.send(appendIdentifier(this.request.struct)); // Define the appendIdentifier function

    while (!final) {
      const theCurrentValue = await firstValueFrom(responsed);

      // console.log(
      //   chalk.bold(
      //     chalk.yellow(
      //       `the current response value is ${JSON.stringify(theCurrentValue)}`,
      //     ),
      //   ),
      // );
      yield theCurrentValue;
    }
  }

  private async initialHandshake(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.wss === null) {
        reject(new Error('WebSocket is not initialized'));
        return;
      }
      const currentWss = this.wss;
      currentWss.once('message', () => {
        // console.log(chalk.bold(chalk.yellow('should have resolve here')));
        resolve();
      });
      currentWss.once('open', async () => {
        // console.log(chalk.bold(chalk.yellow('should have send here')));
        currentWss.send(appendIdentifier({ protocol: 'json', version: 1 }));
      });
    });
  }

  async close(): Promise<void> {
    if (this.wss && this.wss.readyState !== WebSocket.CLOSED) {
      this.wss.close();
    }
  }
}
