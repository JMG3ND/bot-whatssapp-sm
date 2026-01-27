import type { ChatCompletionTool } from '../types'
import { getStock } from '../../../../database'

export const obtener_stock_inventario: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'obtener_stock_inventario',
    description: 'Te da la lista del stock del inventario por descripción del producto',
    parameters: {
      type: 'object',
      properties: {
        descripción: {
          type: 'string',
          description: 'Descripción del producto a buscar en el inventario',
        },
      },
      required: ['descripción'],
    },
  },
}

export async function obtenerStockInventario(descripción: string) {
  return await getStock(descripción)
}
