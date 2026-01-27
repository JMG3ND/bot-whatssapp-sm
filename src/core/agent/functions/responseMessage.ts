import { allTools } from '../tools'
import { readToolCalls, readAiResponse, addMessageToConversation } from '../utils'
import { ejectTools } from '../tools/ejectTools'
import { callAgentWithTools } from './callAgent'

export async function responseMessage(message: string) {
  try {
    const response = await callAgentWithTools(message, allTools)

    const aiResponse = readAiResponse(response)
    const toolCalls = readToolCalls(response)

    if (toolCalls) {
      const updateConversation = addMessageToConversation(message, aiResponse)
      const responseFromTools = await ejectTools(toolCalls)
      const finalMessage = addMessageToConversation(updateConversation, responseFromTools)
      return await responseMessage(finalMessage)
    }

    return aiResponse
  } catch (error) {
    throw new Error(`Error al obtener la respuesta del Agente: ${error}`)
  }
}
