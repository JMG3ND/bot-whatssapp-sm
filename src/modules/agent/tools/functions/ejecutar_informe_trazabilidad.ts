import type { ChatCompletionTool } from '../../types'
import { isObject } from '../../utils'
import { getTrazabilityStation } from '@modules/reports'
import { responseAnalisis , addInstructionsToReport } from '@modules/agent'

export const ejecutar_informe_trazabilidad: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'ejecutar_informe_trazabilidad',
    description: 'Genera un informe de trazabilidad de una estación de trabajo específica, y una fecha determinada. Si no se da fecha la herraminta tomará la fecha actual. "USALO SOLO SI TE PIDEN QUE GENERES EL INFORME". La fecha no es obligatoria.',
    parameters: {
      type: 'object',
      properties: {
        station: {
          type: 'string',
          description: 'Nombre de la estación de trabajo para la cual se desea generar el informe de trazabilidad. La estación debe ser bodega, bodega2, congelado, fileteo o bandejeo',
        },
        date: {
          type: 'string',
          description: 'La fecha no es necesaria pero si la pasas debe estar en formato AAAA-MM-DD',
        },
      },
      required: ['station'],
    },
  },
}

function readArguments(args: string): { station: string, date?: string } {
  const json = JSON.parse(args) as { station: string, date?: string }
  if (!isObject(json) || typeof json.station !== 'string')
    throw 'El argumento debe ser un objeto con una propiedad "station" de tipo string'
  return { station: json.station, date: json.date }
}

export async function obtenerInformeTrazabilidad(args: string) {
  const response = await ejectTool(args)
  const informeString = JSON.stringify(response, null, 2)
  return `Tool: obtener_informe_trazabilidad\nResultado:\n${informeString}`
}

async function ejectTool(args: string) {
  try {
    const { station, date } = readArguments(args)

    const report = await getTrazabilityStation(station, date)
    const instructions = addInstructionsToReport(report)
    const response = await responseAnalisis(instructions)

    return `Esta respuesta ya fue analizada por el AI tienes que replicar tu respuesta tal cual este reporte para que le llegue al ususario:\n\n${response}`
  } catch (error) {
    if (typeof error === 'string')
      return error
    throw error
  }
}
