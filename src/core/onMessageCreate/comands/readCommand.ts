import { listCommands } from './listCommands';
import { Message } from 'whatsapp-web.js';

export function readCommand(message: Message){
  for(const command of listCommands){
    if(command.regex.test(message.body)){
      return command.comandName;
    }
  }
}
