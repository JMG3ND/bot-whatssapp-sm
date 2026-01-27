import { Message } from 'whatsapp-web.js'
import { replyConversation } from './functions/replyConversation'
import { controlErrors } from '../utils/controlErrors'
import { readCommand } from './comands/readCommand'
import { replyCommandsList } from './functions/replyCommandsList'
import { replyClearMemory } from './functions/clearMemory'

export function onMessageCreate(message: Message) {
  controlErrors(async () => {
    const command = readCommand(message)

    switch (command) {
    case 'ai':
      await replyConversation(message)
      break
    case 'help':
      await replyCommandsList(message)
      break
    case 'clear-momory':
      await replyClearMemory(message)
      break
    default:
      return
    }
  })
}
