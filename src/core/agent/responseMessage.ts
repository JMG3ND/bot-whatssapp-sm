import agent from './config/createAgent'

export default async function responseMessage(message: string) {
   try {
      const response = await agent.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 500,
      })
      
      const aiResponse = response.choices[0]?.message?.content || 'Sin respuesta'
      return aiResponse
    } catch (error) {
      console.error('Error al llamar a DeepSeek:', error)
      throw new Error('Error al obtener la respuesta de DeepSeek')
    }
}