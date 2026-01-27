import type { Message } from 'whatsapp-web.js'
import { readUserId } from '../../utils/readUser'
import { clearConversation } from '../../../database'

export async function replyClearMemory(message: Message) {
  const userId = readUserId(message)
  await clearConversation(userId)
  await message.reply('Memoria de conversación limpiada correctamente.')
}
