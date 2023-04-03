import { ConversationStyleEnumType } from '../constants';
import { ChatHub } from './ChatHub'; // Import the ChatHub class from the previous code block
import { Conversation } from './Conversation'; // Import the Conversation class

export class Chatbot {
  chatHub: ChatHub | null = null;
  chatHubInitialization: Promise<void>;

  constructor(
    public cookiePath: string = '',
    public cookies: Record<string, any>[] | null = null,
    public proxy: string | null = null,
  ) {
    this.cookiePath = cookiePath;
    this.cookies = cookies;
    this.proxy = proxy;
    const conversation = new Conversation(cookiePath, cookies, proxy);
    this.chatHubInitialization = conversation.initialize();
    this.chatHubInitialization.then(
      () => (this.chatHub = new ChatHub(conversation, proxy)),
    );
  }

  async ask(
    prompt: string,
    wssLink: string = 'wss://sydney.bing.com/sydney/ChatHub',
    conversationStyle: ConversationStyleEnumType | null = null,
  ): Promise<Record<string, any> | null | string> {
    if (!this.chatHub) {
      throw new Error('the chathub has not initialized!');
    }
    for await (const [final, response] of this.chatHub.askStream(
      prompt,
      wssLink,
      conversationStyle,
    )) {
      if (final) {
        return response;
      }
    }
    if (this.chatHub.wss) {
      this.chatHub.wss.close();
    }
    return null;
  }

  async *askStream(
    prompt: string,
    wssLink: string = 'wss://sydney.bing.com/sydney/ChatHub',
    conversationStyle: ConversationStyleEnumType | null = null,
  ): AsyncGenerator<[boolean, string | Record<string, any>]> {
    if (!this.chatHub) {
      throw new Error('the chathub has not initialized!');
    }
    yield* this.chatHub.askStream(prompt, wssLink, conversationStyle);
  }

  async close(): Promise<void> {
    if (!this.chatHub) {
      throw new Error('the chathub has not initialized!');
    }
    await this.chatHub.close();
  }

  async reset(): Promise<void> {
    await this.close();
    this.chatHub = new ChatHub(
      new Conversation(this.cookiePath, this.cookies),
      this.proxy,
    );
  }
}
