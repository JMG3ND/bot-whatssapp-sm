import { getStock } from '@modules/querys'
import { isObject } from '@modules/agent/utils'
import { Tool, ToolError } from './Tool.class'

const RESPONSES = {
  NO_STOCK: (descripción: string) => `No se encontró stock en el inventario para la descripción: ${descripción}`,
  ERROR: (message: string) => `Error al obtener el stock del inventario: ${message}`,
  ARGUMENT_STRING: 'El argumento debe ser un objeto con una propiedad "descripción" de tipo string',
}

export const toolGetStock = new Tool({
  name: 'obtener_stock_inventario',
  toolDescription: {
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
  },
  onEjectTool: async function (args: string) {
    const { descripción } = readArguments(args)
    const response = await getStock(descripción)

    if (response.length === 0) {
      throw new ToolError(RESPONSES.NO_STOCK(descripción))
    }

    const stockString = JSON.stringify(response, null, 2)
    return stockString
  },
})

function readArguments(args: string): { descripción: string } {
  const json = JSON.parse(args) as { descripción: string }
  if (!isObject(json) || typeof json.descripción !== 'string')
    throw new ToolError(RESPONSES.ARGUMENT_STRING)

  return { descripción: json.descripción }
}
