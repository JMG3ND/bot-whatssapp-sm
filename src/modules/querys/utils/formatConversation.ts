import type { Conversation } from '@database/brain/client'

export function formatConversation(conversations: Conversation[], newMessage?: string): string {
  return conversations.map(convo => {
    return `${convo.user_message}\nBot: ${convo.bot_response}`
  }).join('\n') + (newMessage ? `\n${newMessage}` : '')
}
