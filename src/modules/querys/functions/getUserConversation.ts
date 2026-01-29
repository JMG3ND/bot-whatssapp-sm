import { brainConnection } from '@database'
import { formatConversation } from '@modules/querys/utils/formatConversation'

export async function getUserConversation(user: string, newMessage: string) {
  return formatConversation(
    await brainConnection.conversation.findMany({
      where: {
        user: user,
      },
      take: 10,
      orderBy: {
        createdAt: 'asc',
      },
    }), newMessage)
}
