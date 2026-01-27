import type { ChatCompletion } from '../types'

export function readToolCalls(response: ChatCompletion) {
  return response.choices[0]?.message?.tool_calls
}
