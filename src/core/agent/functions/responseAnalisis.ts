import { readAiResponse } from '../utils'
import { callReasonerAgent } from './callReasonerAgent'

export async function responseAnalisis(message: string) {
  try {
    const response = await callReasonerAgent(message)
    console.log(response)
    const aiResponse = readAiResponse(response)

    return aiResponse
  } catch (error) {
    throw new Error(`Error al obtener la respuesta del Agente: ${error}`)
  }
}
