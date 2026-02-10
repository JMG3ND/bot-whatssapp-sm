import type { ChatCompletionMessageToolCall } from '../types'
import * as allTools from './functions'
import { readArguments } from '../utils/readArguments'

export async function ejectTools(
  toolCalls: ChatCompletionMessageToolCall[],
) {
  const response: string[] = []
  const ejectTolls = toolCalls.map(async (toolCall) => {
    if (toolCall.type === 'function') {
      const toolArgs = readArguments(toolCall)
      const toolName = toolCall.function.name

      let toolFound = false
      for (const tool of Object.values(allTools)) {
        if (tool.name === toolName) {
          toolFound = true
          const result = await tool.ejectTool(toolArgs)
          response.push(result)
          break
        }
      }

      if (!toolFound) {
        response.push(`Herramienta desconocida: ${toolName}`)
      }
    }
  })

  await Promise.all(ejectTolls)

  return response.join('\n')
}
