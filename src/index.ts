#!/usr/bin/env node
import { ArgumentParser } from 'argparse';
import * as fs from 'fs';
import { main } from './main'; // Assuming the 'main' function is exported from the 'main.ts' file

console.log(`
    EdgeGPTJs - A demo of reverse engineering the Bing GPT chatbot
    Repo: github.com/lonelam/EdgeGPTJs
    By: Lai Zenan

    !help for help

    Type !exit to exit
`);

const parser = new ArgumentParser();
parser.add_argument('--enter-once', { action: 'store_true' });
parser.add_argument('--no-stream', { action: 'store_true' });
parser.add_argument('--rich', { action: 'store_true' });
parser.add_argument('--proxy', {
  help: 'Proxy URL (e.g. socks5://127.0.0.1:1080)',
  type: 'str',
});
parser.add_argument('--wss-link', {
  help: 'WSS URL(e.g. wss://sydney.bing.com/sydney/ChatHub)',
  type: 'str',
  default: 'wss://sydney.bing.com/sydney/ChatHub',
});
parser.add_argument('--style', {
  choices: ['creative', 'balanced', 'precise'],
  default: 'balanced',
});
parser.add_argument('--cookie-file', {
  type: 'str',
  default: 'cookies.json',
  required: false,
  help: 'needed if environment variable COOKIE_FILE is not set',
});

const args = parser.parse_args();

if (fs.existsSync(args.cookie_file)) {
  process.env['COOKIE_FILE'] = args.cookie_file;
} else {
  parser.print_help();
  parser.exit(
    1,
    'ERROR: use --cookie-file or set environment variable COOKIE_FILE',
  );
}

main(args);
