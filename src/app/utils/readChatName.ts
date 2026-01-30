import type { Message } from 'whatsapp-web.js'

export async function readChatName(message: Message): Promise<string> {
  const chat = await message.getChat()
  const userId = chat.name
  return userId
}
