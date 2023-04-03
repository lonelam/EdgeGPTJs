#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const fs = __importStar(require("fs"));
const main_1 = require("../lib/main"); // Assuming the 'main' function is exported from the 'main.ts' file
console.log(`
    EdgeGPTJs - A demo of reverse engineering the Bing GPT chatbot
    Repo: github.com/lonelam/EdgeGPTJs
    By: Lai Zenan

    !help for help

    Type !exit to exit
`);
const parser = new argparse_1.ArgumentParser();
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
}
else {
    parser.print_help();
    parser.exit(1, 'ERROR: use --cookie-file or set environment variable COOKIE_FILE');
}
(0, main_1.main)(args);
