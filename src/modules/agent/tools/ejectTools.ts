import type { ChatCompletionMessageToolCall } from '../types'
import { obtenerStockInventario, obtenerInformeTrazabilidad, getToolGetFrozenPacking, getCurrentDate } from './functions'
import { readArguments } from '../utils/readArguments'

export async function ejectTools(
  toolCalls: ChatCompletionMessageToolCall[],
) {
  const response: string[] = []
  for (const toolCall of toolCalls) {
    if (toolCall.type === 'function') {
      const args = readArguments(toolCall)
      switch (toolCall.function.name) {
      case 'obtener_stock_inventario': {
        response.push(await obtenerStockInventario(args))
        break
      }
      case 'ejecutar_informe_trazabilidad': {
        response.push(await obtenerInformeTrazabilidad(args))
        break
      }
      case 'obtener_empaque_congelado': {
        response.push(await getToolGetFrozenPacking(args))
        break
      }
      case 'obtener_fecha_actual': {
        response.push(await getCurrentDate())
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
