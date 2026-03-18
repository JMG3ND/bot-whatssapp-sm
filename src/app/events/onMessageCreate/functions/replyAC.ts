import type { Message } from 'whatsapp-web.js'
import { getInstruction, callAgentWithMCP } from '@modules/agent'
import { readPrompt } from '@/utils'

export async function replyAC(message: Message) {
  const newMessage = readPrompt(message)
  const instruction = getInstruction('agentAC', newMessage)
  const aiResponse = await callAgentWithMCP(instruction)
  await message.reply(aiResponse)
}
