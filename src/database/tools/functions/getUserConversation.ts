import { brainConnection } from '../../index'
import { formatConversation } from '../utils/formatConversation'

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
