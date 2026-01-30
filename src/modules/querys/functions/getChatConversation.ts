import { brainConnection } from '@database'
import { formatConversation } from '@modules/querys/utils/formatConversation'

export async function getChatConversation(chat: string, userName: string, newMessage: string) {
  return formatConversation(
    await brainConnection.conversation.findMany({
      where: {
        chat: chat,
      },
      take: 10,
      orderBy: {
        createdAt: 'asc',
      },
    }), `${userName}: ${newMessage}`)
}
