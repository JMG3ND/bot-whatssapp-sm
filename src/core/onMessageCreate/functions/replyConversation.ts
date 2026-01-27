import type { Message } from 'whatsapp-web.js'
import responseMessage from '../../agent/responseMessage'
import { validateCommand } from '../comands/validateComands'
import { readPrompt } from '../../utils/readPrompt'
import { readUserId } from '../../utils/readUser'
import { registerConversation } from '../../../tools'
import { getUserConversation } from '../../../tools/functions/getUserConversation'
import { getInstruction } from '../../agent/tools'

export async function replyConversation(message: Message) {
  if (!validateCommand(message.body)) return
  const user = readUserId(message)
  const newMessage = readPrompt(message)
  const conversation = await getUserConversation(user, newMessage)
  const instruction = getInstruction('conversation', conversation)
  const aiResponse = await responseMessage(instruction)
  await registerConversation({
    user: user,
    user_message: newMessage,
    bot_response: aiResponse,
  })
  await message.reply(aiResponse)
}
