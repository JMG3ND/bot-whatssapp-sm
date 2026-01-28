import agent from '../config/createAgent'

export async function callReasonerAgent(message: string) {
  return await agent.chat.completions.create({
    model: 'deepseek-reasoner',
    messages: [
      { role: 'user', content: message },
    ],
    temperature: 0.1,
  })
}
