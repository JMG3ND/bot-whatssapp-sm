import type { ChatCompletionMessageToolCall } from '../types'
import { obtenerStockInventario, obtenerInformeTrazabilidad } from './functions'

export async function ejectTools(
  toolCalls: ChatCompletionMessageToolCall[],
) {
  const response: string[] = []
  for (const toolCall of toolCalls) {
    if (toolCall.type === 'function') {
      switch (toolCall.function.name) {
      case 'obtener_stock_inventario': {
        response.push(await obtenerStockInventario(toolCall.function.arguments))
        break
      }
      case 'ejecutar_informe_trazabilidad': {
        response.push(await obtenerInformeTrazabilidad(toolCall.function.arguments))
        break
      }
      default:
        response.push(`Herramienta desconocida: ${toolCall.function.name}`)
        break
      }
    }
  }
  return response.join('\n')
}
