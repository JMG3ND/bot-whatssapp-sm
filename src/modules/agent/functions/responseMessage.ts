import { allInformationTools, ejectTools } from '../tools'
import { readToolCalls, readAiResponse, addMessageToConversation } from '../utils'
import { callAgentWithTools } from './callAgentWithTools'

type OnToolsCalls = (message: string) => Promise<void>

export async function responseMessage(
  message: string,
  onToolsCalls?: OnToolsCalls )
{
  try {
    const response = await callAgentWithTools(message, allInformationTools)

    const aiResponse = readAiResponse(response)
    const toolCalls = readToolCalls(response)

    if (toolCalls) {
      if (aiResponse && onToolsCalls) await onToolsCalls(aiResponse)
      const updateConversation = addMessageToConversation(message, aiResponse)
      const responseFromTools = await ejectTools(toolCalls)
      const finalMessage = addMessageToConversation(updateConversation, responseFromTools)
      return await responseMessage(finalMessage, onToolsCalls)
    }

    return aiResponse
  } catch (error) {
    throw new Error(`Error al obtener la respuesta del Agente: ${error}`)
  }
}
