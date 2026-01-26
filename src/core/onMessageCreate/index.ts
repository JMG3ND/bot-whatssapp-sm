import { Message } from 'whatsapp-web.js';
import { replyConversation } from './functions/replyConversation';
import { controlErrors } from '../utils/controlErrors';
import { readCommand } from './comands/readCommand';
import { replyCommandsList } from './functions/replyCommandsList';

export function onMessageCreate(message: Message) {
  controlErrors(async () => {
    const command = readCommand(message);

    switch (command) {
      case 'ai':
        await replyConversation(message);
        break;
      case 'help':
        await replyCommandsList(message);
        break;
      default:
        return;
    }
  });  
}
