import type { ChatCompletionMessageToolCall } from '../types'

export function readArguments(toolCall: ChatCompletionMessageToolCall): string  {
  if (toolCall.type !== 'function') return ''
  return toolCall.function.arguments || ''
}
