import { Message } from 'whatsapp-web.js'

export async function readUserName(message: Message): Promise<string> {
  const chat = await message.getChat()
  if (chat.isGroup) {
    const contact = await message.getContact()
    return contact.pushname || contact.number
  } else {
    return chat.name || chat.id.user
  }
}
