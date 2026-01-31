import type { ChatCompletionTool } from '../../types'
import { getFrozenPacking } from '@modules/querys'

export const obtener_empaque_por_estacion: ChatCompletionTool = {
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
}

function readArguments(args: string): { date?: string } {
  const json = JSON.parse(args) as { date?: string }
  return { date: json.date }
}

export async function getToolGetFrozenPacking(args: string) {
  const response = await ejectTool(args)
  const stockString = JSON.stringify(response, null, 2)
  return `Tool: obtener_empaque_congelado\nResultado:\n${stockString}`
}

async function ejectTool(args: string) {
  try {
    const { date } = readArguments(args)
    const response = await getFrozenPacking(date)

    if (response.length === 0) {
      return 'No hay empaques'
    }

    return response
  } catch (error) {
    if (typeof error === 'string')
      return `Error al obtener el empaque de congelado: ${error}`
    throw error
  }
}
