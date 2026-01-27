import agent from '../config/createAgent'
import type { ChatCompletionTool } from '../types'

export async function callAgentWithTools(message: string, tools?: ChatCompletionTool[]) {
  return await agent.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'assistant', content: message },
    ],
    tools: tools,
    tool_choice: tools ? 'auto' : 'none',
    temperature: 0.1,
    max_tokens: 1000,
  })
}
