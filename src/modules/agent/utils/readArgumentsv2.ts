import type { ChatCompletionMessageToolCall } from '../types'

export function readArgumentsv2(toolCall: ChatCompletionMessageToolCall): { args: string; name: string } {
  if (toolCall.type !== 'function') return { args: '', name: '' }
  return {
    args: toolCall.function.arguments || '',
    name: toolCall.function.name,
  }
}
