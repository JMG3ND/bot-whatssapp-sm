const instructions = {
  conversation: 'Sigue la conversación de manera coherente y relevante.',
}

export function getInstruction(tool: keyof typeof instructions, content?: string): string {
  return instructions[tool] + (content ? `\n\n${content}` : '')
}
