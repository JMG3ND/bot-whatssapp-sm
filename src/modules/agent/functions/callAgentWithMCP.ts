import agent from '../config/createAgent'
import { getMcpTools, callMcpTool } from '../config/mcpClient'
import { readToolCalls, readAiResponse, readArgumentsv2 } from '../utils'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const MAX_TOOL_ROUNDS = 20

export async function callAgentWithMCP(message: string, onToolCall?: (message: string) => Promise<void>) {
  const tools = await getMcpTools()

  const messages: ChatCompletionMessageParam[] = [
    { role: 'user', content: message },
  ]

  for (let i = 0; i < MAX_TOOL_ROUNDS; i++) {
    const response = await agent.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      tools,
      tool_choice: 'auto',
      temperature: 0.1,
    })

    const toolCalls = readToolCalls(response)
    const aiResponse = readAiResponse(response)

    if (!toolCalls) {
      return aiResponse
    }

    messages.push(response.choices[0].message)

    for (const toolCall of toolCalls) {
      const { args, name } = readArgumentsv2(toolCall)
      const argsString = JSON.parse(args)
      const result = await callMcpTool(name, argsString)

      if (onToolCall) {
        await onToolCall(result)
      }

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      })
    }
  }

  const finalResponse = await agent.chat.completions.create({
    model: 'deepseek-chat',
    messages,
    temperature: 0.1,
  })

  return readAiResponse(finalResponse)
}
