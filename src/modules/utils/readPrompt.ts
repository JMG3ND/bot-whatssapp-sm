import { listCommands } from '../onMessageCreate/comands/listCommands'
import type { Message } from 'whatsapp-web.js'

const regexCommand = listCommands.find(cmd => cmd.comandName === 'ai')?.regex

export function readPrompt(message: Message): string {
  if (!regexCommand) throw new Error('Prompt is empty after removing command.')
  const prompt = message.body.replace(regexCommand, '').trim()
  if (prompt.length === 0) throw new Error('Prompt is empty after removing command.')
  return prompt
}
