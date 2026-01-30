import { Message } from 'whatsapp-web.js'
import { replyConversation } from './functions/replyConversation'
import { readCommand } from './commands/readCommand'
import { replyCommandsList } from './functions/replyCommandsList'
import { replyClearMemory } from './functions/clearMemory'
import { namesComands } from './commands/listCommands'
import { replyTrazabilityReport } from './functions/replyTrazabilityReport'
import { activeTyping } from '@/utils'
/**
 * Redirección de mensajes entrantes a la función correspondiente según el comando detectado.
 * @param message Mensaje entrante de WhatsApp
 * @returns void
 */
export async function onMessageCreate(message: Message) {
  const command = readCommand(message)
  switch (command) {
  case namesComands.ai:
    await activeTyping(message, replyConversation)
    break
  case namesComands.help:
    await replyCommandsList(message)
    break
  case namesComands.trazability:
    await activeTyping(message, replyTrazabilityReport)
    break
  case namesComands['clear-memory']:
    await replyClearMemory(message)
    break
  default:
    return
  }
}
