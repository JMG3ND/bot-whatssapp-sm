import { listCommands } from '../comands/listCommands'

const regexCommand = listCommands.find(cmd => cmd.comandName === 'ai')?.regex

export function readPrompt(messageBody: string): string {
  if (!regexCommand) throw new Error('Prompt is empty after removing command.')
  const prompt = messageBody.replace(regexCommand, '').trim()
  if (prompt.length === 0) throw new Error('Prompt is empty after removing command.')
  return prompt
}
