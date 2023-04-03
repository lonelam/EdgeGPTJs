import { ConversationStyleEnumType } from '../constants';
import { getRanHex } from '../utils';
export const DEFAULT_UPDATE_OPTION = [
  'deepleo',
  'enable_debug_commands',
  'disable_emoji_spoken_text',
  'enablemm',
];
export type ChatHubRequestStruct =
  | {
      arguments: any[];
      invocationId: string;
      target: 'chat';
      type: 4;
    }
  | {};
/**
 * Request object for ChatHub
 */
export class ChatHubRequest {
  public struct: ChatHubRequestStruct = {};
  constructor(
    public conversation_signature: string,
    public client_id: string,
    public conversation_id: string,
    public invocation_id: number = 0,
  ) {}
  /**
   * Updates request object
   * @param prompt
   * @param conversation_style
   * @param options
   */
  public update(
    prompt: string,
    conversation_style: ConversationStyleEnumType | null = null,
    options: string[] | null = null,
  ) {
    if (options === null) {
      options = DEFAULT_UPDATE_OPTION;
    }
    if (conversation_style) {
      options = [
        'nlu_direct_response_filter',
        'deepleo',
        'disable_emoji_spoken_text',
        'responsible_ai_policy_235',
        'enablemm',
        conversation_style,
        'dtappid',
        'cricinfo',
        'cricinfov2',
        'dv3sugg',
      ];
    }
    this.struct = {
      arguments: [
        {
          source: 'cib',
          optionsSets: options,
          sliceIds: ['222dtappid', '225cricinfo', '224locals0'],
          traceId: getRanHex(32),
          isStartOfSession: this.invocation_id == 0,
          message: {
            author: 'user',
            inputMethod: 'Keyboard',
            text: prompt,
            messageType: 'Chat',
          },
          conversationSignature: this.conversation_signature,
          participant: {
            id: this.client_id,
          },
          conversationId: this.conversation_id,
        },
      ],
      invocationId: String(this.invocation_id),
      target: 'chat',
      type: 4,
    };
    this.invocation_id += 1;
  }
}
