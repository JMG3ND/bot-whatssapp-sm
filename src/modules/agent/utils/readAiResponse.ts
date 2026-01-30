import type { ChatCompletion } from '../types'

export function readAiResponse(response: ChatCompletion) {
  return response.choices[0]?.message?.content || ''
}
