import { Tool, ToolError } from './Tool.class'
import { getFrozenPacking } from '@modules/querys'

const RESPONSES = {
  NO_PACKING: (date?: string) => `${date ?? 'Hoy'} no hay productos empacados en la estación de congelado.`,
  ERROR: (message: string) => `Error al obtener el empaque de congelado: ${message}`,
}

export const toolGetFrozenPacking = new Tool({
  name: 'obtener_empaque_congelado',
  toolDescription: {
    type: 'function',
    function: {
      name: 'obtener_empaque_congelado',
      description: 'Te da una lista de los productos empacados por la estación de congelado, no mandes el aprámetro fecha si no te la dan',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Fecha para filtrar los productos empacados en la estación de congelado, no obligatorio, en formato AAAA-MM-DD',
          },
        },
      },
    },
  },
  onEjectTool: async function (args: string) {
    const { date } = readArguments(args)
    const response = await getFrozenPacking(date)

    if (response.length === 0) {
      throw new ToolError(RESPONSES.NO_PACKING(date))
    }

    const stockString = JSON.stringify(response, null, 2)
    return stockString
  },
})

function readArguments(args: string): { date?: string } {
  const json = JSON.parse(args) as { date?: string }
  return { date: json.date }
}
