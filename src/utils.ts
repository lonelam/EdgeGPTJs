import { DELIMITER } from './constants';
import { randomBytes } from 'crypto';
import { AxiosProxyConfig } from 'axios';

/**
 * Appends special character to end of message to identify end of message
 * @param msg
 * @returns
 */
export function appendIdentifier(msg: any): string {
  return JSON.stringify(msg) + DELIMITER;
}
/**
 * Returns random hex string
 * @param length
 */
export function getRanHex(length: number = 32): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export function parseProxyString(proxyString: string): AxiosProxyConfig {
  const url = new URL(proxyString);
  const result: AxiosProxyConfig = {
    host: url.hostname,
    port: parseInt(url.port, 10),
  };
  if (url.protocol.startsWith('http') || url.protocol.startsWith('https')) {
    result.protocol = url.protocol;
  }
  if (url.username || url.password) {
    result.auth = {
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
    };
  }
  return result;
}
