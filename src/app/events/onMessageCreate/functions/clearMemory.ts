import type { Message } from 'whatsapp-web.js'
import { readChatName } from '@/utils'
import { clearConversation } from '@modules/querys'

export async function replyClearMemory(message: Message) {
  const chatName = await readChatName(message)
  await clearConversation(chatName)
  await message.reply('Memoria de conversación limpiada correctamente.')
}
