import type { Message } from 'whatsapp-web.js'
import { responseMessage, getInstruction } from '@modules/agent'
import { readPrompt, readChatName, readUserName } from '@/utils'
import { registerConversation, getChatConversation } from '@database'

export async function replyConversation(message: Message) {
  const chatName = await readChatName(message)
  const newMessage = readPrompt(message)
  const userName = await readUserName(message)
  const conversation = await getChatConversation(chatName, userName, newMessage)
  const instruction = getInstruction('conversation', conversation)
  const aiResponse = await responseMessage(instruction, async (msg) => {
    await message.reply(msg)
  })
  await registerConversation({
    chat: chatName,
    userName: userName,
    user_message: newMessage,
    bot_response: aiResponse,
  })
  await message.reply(aiResponse)
}
