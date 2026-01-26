import agent from './config/createAgent'
import { getInstruction } from './tools'

export default async function responseMessage(message: string) {
   try {
      const instruction = getInstruction('conversation', message)
      const response = await agent.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: instruction }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      })
      
      const aiResponse = response.choices[0]?.message?.content || 'Sin respuesta'
      return aiResponse
    } catch (error) {
      throw new Error(`Error al obtener la respuesta de DeepSeek: ${error}`)
    }
}
