import { createInterface } from 'readline';
import chalk from 'chalk';
import { Chatbot } from './chathub/ChatBot';
import ora from 'ora'; // Import the ora package
import { ConversationStyleEnumType } from './constants';

async function getLine(prompt: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getPara(prompt: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.stdin.on('keypress', (ch, key) => {
    if (key && key.alt && key.name === 'enter') {
      rl.close();
    }
  });

  const lines: string[] = [];
  let inputMode = true;

  console.log(prompt);

  return new Promise((resolve) => {
    rl.on('line', (line) => {
      if (inputMode) {
        lines.push(line);
      }
    });

    rl.on('SIGINT', () => {
      inputMode = false;
      rl.close();
      resolve(lines.join('\n'));
    });
  });
}

export async function main(
  args: {
    proxy: string;
    enterOnce: boolean;
    noStream: boolean;
    rich: boolean;
    style: null | ConversationStyleEnumType;
    wssLink: string;
    cookiePath: string;
  } = {
    proxy: '',
    enterOnce: false,
    noStream: false,
    rich: true,
    style: null,
    wssLink: 'wss://sydney.bing.com/sydney/ChatHub',
    cookiePath: process.env.COOKIE_FILE || 'cookie.json',
  },
) {
  console.log('Initializing...');

  const bot = new Chatbot(args.cookiePath);
  await bot.chatHubInitialization;
  console.log('Enter `alt+enter` or `control+C` to send a message');
  let question: string;

  while (true) {
    console.log('\nYou:');
    question = args.enterOnce ? await getLine('') : await getPara('');
    console.log();

    if (question === '!exit') {
      break;
    }
    if (question === '!help') {
      console.log(`
        !help - Show this help message
        !exit - Exit the program
        !reset - Reset the conversation
      `);
      continue;
    }
    if (question === '!reset') {
      await bot.reset();
      continue;
    }
    console.log('Bot:');

    if (args.noStream) {
      const response = await bot.ask(question, args.wssLink, args.style);
      if (typeof response === 'string' || !response) {
        console.log(chalk.bold(response));
      } else {
        console.log(
          response['item']['messages'][1]['adaptiveCards'][0]['body'][0][
            'text'
          ],
        );
      }
    } else {
      let wrote = 0;
      if (args.rich) {
        const spinner = ora({ text: '', spinner: 'dots' }).start();
        for await (const [final, response] of bot.askStream(
          question,
          args.wssLink,
          args.style,
        )) {
          if (!final) {
            if (wrote > response.length) {
              console.log(chalk.red('***Bing revoked the response.***'));
            }
            wrote = response.length;
            spinner.text = String(response);
          }
        }
        spinner.stop();
        console.log(chalk.yellow(spinner.text));
      } else {
        for await (const [final, response] of bot.askStream(
          question,
          args.wssLink,
          args.style,
        )) {
          if (!final) {
            process.stdout.write(response.slice(wrote));
            wrote = response.length;
          }
        }
        console.log();
      }
    }
  }
  await bot.close();
}

// main();
