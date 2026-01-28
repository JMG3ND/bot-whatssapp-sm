import { Message } from 'whatsapp-web.js'
import { replyConversation } from './functions/replyConversation'
import { controlErrors } from '../utils/controlErrors'
import { readCommand } from './comands/readCommand'
import { replyCommandsList } from './functions/replyCommandsList'
import { replyClearMemory } from './functions/clearMemory'
import { namesComands } from './comands/listCommands'
import { replyTrazabilityReport } from './functions/replyTrazabilityReport'

export function onMessageCreate(message: Message) {
  controlErrors(async () => {
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
    case namesComands['clear-momory']:
      await replyClearMemory(message)
      break
    default:
      return
    }
  })
}
