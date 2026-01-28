import type { Message } from 'whatsapp-web.js'
import { getTrazabilityStation } from '../../reports/trazability/getTrazabilityStation'
import { responseAnalisis , addInstructionsToReport } from '../../agent'

function readStationFromMessage(message: Message): string {
  const parts = message.body.split(' ')
  if (typeof parts[1] !== 'string') throw 'No se proporcionó una estación válida.'
  return parts[1].trim()
}

export async function replyTrazabilityReport(message: Message) {
  try {
    const station = readStationFromMessage(message)
    const report = await getTrazabilityStation(station)
    const instructions = addInstructionsToReport(report)

    await message.reply('Generando reporte, por favor espera...')
    const aiResponse = await responseAnalisis(instructions)

    await message.reply(aiResponse)
  } catch (error) {
    await message.reply('Ocurrió un error al generar el reporte de trazabilidad.')
    if (typeof error === 'string') {
      await message.reply(error)
      return
    }
    throw error
  }
}
