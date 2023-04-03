import { DELIMITER } from './constants';
import { randomBytes } from 'crypto';

/**
 * Appends special character to end of message to identify end of message
 * @param msg
 * @returns
 */
export function append_identifier(msg: Record<string, string>): string {
  return JSON.stringify(msg) + DELIMITER;
}
/**
 * Returns random hex string
 * @param length
 */
export function get_ran_hex(length: number = 32): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}
