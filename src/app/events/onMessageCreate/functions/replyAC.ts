import type { Message } from 'whatsapp-web.js'
import { getInstruction, callAgentWithMCP } from '@modules/agent'
import { readPrompt, readChatName, readUserName } from '@/utils'
import { registerConversation, getChatConversation } from '@modules/querys'

export async function replyAC(message: Message) {
  const chatName = await readChatName(message)
  const newMessage = readPrompt(message)
  const userName = await readUserName(message)
  const conversation = await getChatConversation(`ac_${chatName}`, userName, newMessage)
  const instruction = getInstruction('agentAC', conversation)
  const aiResponse = await callAgentWithMCP(instruction, async (msg) => {
    if(!msg) return
    const chat = await message.getChat()
    await chat.sendMessage(msg)
  })
  await registerConversation({
    chat: `ac_${chatName}`,
    userName: userName,
    user_message: newMessage,
    bot_response: aiResponse,
  })
  await message.reply(aiResponse)
}
