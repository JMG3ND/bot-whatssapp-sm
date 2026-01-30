import type { Message } from 'whatsapp-web.js'
import { getCommandsList } from '../commands/getCommandsList'

export async function replyCommandsList(message: Message) {
  const commandsList = getCommandsList()
  await message.reply(`Lista de comandos disponibles:\n\n${commandsList}`)
}
