import type { ChatCompletionTool } from '../../types'
import { getStock } from '@database'
import { isObject } from '../../utils'

export const obtener_stock_inventario: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'obtener_stock_inventario',
    description: 'Te da la lista del stock del inventario por descripción o upc de un producto',
    parameters: {
      type: 'object',
      properties: {
        descripción: {
          type: 'string',
          description: 'Descripción del producto a buscar en el inventario, puede ser el nombre, el item, el upc o la especie',
        },
      },
      required: ['descripción'],
    },
  },
}

function readArguments(args: string): { descripción: string } {
  const json = JSON.parse(args) as { descripción: string }
  if (!isObject(json) || typeof json.descripción !== 'string')
    throw 'El argumento debe ser un objeto con una propiedad "descripción" de tipo string'
  return { descripción: json.descripción }
}

export async function obtenerStockInventario(args: string) {
  const response = await ejectTool(args)
  const stockString = JSON.stringify(response, null, 2)
  return `Tool: obtener_stock_inventario\nResultado:\n${stockString}`
}

async function ejectTool(args: string) {
  try {
    const { descripción } = readArguments(args)
    const response = await getStock(descripción)

    if (response.length === 0) {
      return `No existe producto con la descripción o upc: "${descripción}".`
    }

    return response
  } catch (error) {
    if (typeof error === 'string')
      return `Error al obtener el stock del inventario: ${error}`
    throw error
  }
}
