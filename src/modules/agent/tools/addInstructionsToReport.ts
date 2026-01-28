import { getInstruction } from './instructions'

export function addInstructionsToReport(report: string) {
  return `${getInstruction('trazability')}\n${report}`
}
