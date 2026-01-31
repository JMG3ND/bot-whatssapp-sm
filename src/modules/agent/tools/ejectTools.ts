import type { ChatCompletionMessageToolCall } from '../types'
import * as allTools from './functions'
import { readArguments } from '../utils/readArguments'

export async function ejectTools(
  toolCalls: ChatCompletionMessageToolCall[],
) {
  const response: string[] = []
  for (const toolCall of toolCalls) {
    if (toolCall.type === 'function') {
      const toolArgs = readArguments(toolCall)
      const toolName = toolCall.function.name

      for (const tool of Object.values(allTools)) {
        if (tool.name === toolName) {
          const result = await tool.ejectTool(toolArgs)
          response.push(result)
        }
      }
    }
  }
  return response.join('\n')
}
