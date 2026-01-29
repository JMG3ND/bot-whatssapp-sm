import { Message } from 'whatsapp-web.js'

export async function activeTyping(message: Message, functionToExecute: (msg: Message) => Promise<void>) {
  const chat = await message.getChat()
  await chat.sendStateTyping()
  await functionToExecute(message)
  await chat.clearState()
}
