import type { Message } from 'whatsapp-web.js'
import { responseMessage, getInstruction } from '@modules/agent'
import { validateCommand } from '../comands/validateComands'
import { readPrompt, readUserId } from '@/utils'
import { registerConversation, getUserConversation } from '@database'

export async function replyConversation(message: Message) {
  if (!validateCommand(message.body)) return
  const user = readUserId(message)
  const newMessage = readPrompt(message)
  const conversation = await getUserConversation(user, newMessage)
  const instruction = getInstruction('conversation', conversation)
  const aiResponse = await responseMessage(instruction, async (msg) => {
    await message.reply(msg)
  })
  await registerConversation({
    user: user,
    user_message: newMessage,
    bot_response: aiResponse,
  })
  await message.reply(aiResponse)
}
