import agent from './config/createAgent'
import { allTools } from './tools'
import { getStock } from '../../database'

export default async function responseMessage(message: string) {
  try {
    const response = await agent.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: message },
      ],
      tools: allTools,
      tool_choice: 'auto',
      temperature: 0.1,
      max_tokens: 1000,
    })

    const aiResponse = response.choices[0]?.message?.content || 'Sin respuesta'

    const toolCalls = response.choices[0]?.message?.tool_calls
    if (toolCalls) {
      for (const toolCall of toolCalls) {
        if (toolCall.type === 'function') {
          if (toolCall.function.name === 'obtener_stock_inventario') {
            const description = toolCall.function.arguments
            const descriptionParsed = JSON.parse(description)
            const descriptionValue = descriptionParsed['descripción']
            const descriptionString = String(descriptionValue)
            console.log('Llamada a la función obtener_stock_inventario con argumentos:', toolCall.function.arguments)
            console.log('Descripción del producto recibida para obtener stock:', descriptionString)
            const stock = await getStock(descriptionString)
            const stockString = JSON.stringify(stock, null, 2)
            const message2 = `${message}
${aiResponse ? '\n' + aiResponse : '' }
Aquí está la información del stock para la descripción "${descriptionString}":
${stockString}`
            return (await agent.chat.completions.create({
              model: 'deepseek-chat',
              messages: [
                { role: 'user', content: message2 },
              ],
              tools: allTools,
              tool_choice: 'auto',
              temperature: 0.1,
              max_tokens: 1000,
            })).choices[0]?.message?.content || 'Sin respuesta'
          }
        }
      }
    }

    return aiResponse
  } catch (error) {
    throw new Error(`Error al obtener la respuesta de DeepSeek: ${error}`)
  }
}
