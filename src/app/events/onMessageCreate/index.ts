import { Message } from 'whatsapp-web.js'
import { replyConversation } from './functions/replyConversation'
import { readCommand } from './comands/readCommand'
import { replyCommandsList } from './functions/replyCommandsList'
import { replyClearMemory } from './functions/clearMemory'
import { namesComands } from './comands/listCommands'
import { replyTrazabilityReport } from './functions/replyTrazabilityReport'

/**
 * Redirección de mensajes entrantes a la función correspondiente según el comando detectado.
 * @param message Mensaje entrante de WhatsApp
 * @returns void
 */
export async function onMessageCreate(message: Message) {
  const command = readCommand(message)

  switch (command) {
  case namesComands.ai:
    await replyConversation(message)
    break
  case namesComands.help:
    await replyCommandsList(message)
    break
  case namesComands.trazability:
    await replyTrazabilityReport(message)
    break
  case namesComands['clear-memory']:
    await replyClearMemory(message)
    break
  default:
    return
  }
}
