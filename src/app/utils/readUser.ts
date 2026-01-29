import type { Message } from 'whatsapp-web.js'

export function readUserId(message: Message): string {
  const userId = message.from
  return userId
}
