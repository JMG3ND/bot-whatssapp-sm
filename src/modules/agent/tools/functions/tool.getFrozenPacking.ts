import { Tool, ToolError } from './Tool.class'
import { getProcessedProducts } from '@modules/querys'

const RESPONSES = {
  NO_PACKING: (date?: string) => `${date ?? 'Hoy'} no hay productos empacados en la estación de congelado.`,
  ERROR: (message: string) => `Error al obtener el empaque de congelado: ${message}`,
  STATION_PARAMETER_MISSING: 'Falta el parámetro obligatorio: station',
}

export const toolGetProcessedProducts = new Tool({
  name: 'obtener_productos_procesados',
  toolDescription: {
    type: 'function',
    function: {
      name: 'obtener_productos_procesados',
      description: 'Te da una lista de los productos procesados por estación, las estaciones son: congelado, bodega, bodega2, bandejeo y fileteo.',
      parameters: {
        type: 'object',
        properties: {
          station: {
            type: 'string',
            description: 'Estación para filtrar los productos procesados, no obligatorio, las estaciones son: congelado, bodega, bodega2, bandejeo y fileteo.',
          },
          date: {
            type: 'string',
            description: 'Fecha para filtrar los productos procesados por estación, no obligatorio, en formato AAAA-MM-DD',
          },
        },
        required: ['station'],
      },
    },
  },
  onEjectTool: async function (args: string) {
    const { date, station } = readArguments(args)
    const response = await getProcessedProducts(station, date)

    if (response.length === 0) {
      throw new ToolError(RESPONSES.NO_PACKING(date))
    }

    const stockString = JSON.stringify(response, null, 2)
    return stockString
  },
})

function readArguments(args: string): { date?: string, station: string } {
  const json = JSON.parse(args) as { date?: string, station?: string }
  if (!json.station) {
    throw new ToolError(RESPONSES.STATION_PARAMETER_MISSING)
  }
  return { date: json.date, station: json.station }
}
