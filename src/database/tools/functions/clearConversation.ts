import { brainConnection } from '../../brainConnection'

export async function clearConversation(user: string) {
  await brainConnection.conversation.deleteMany({
    where: {
      user: user,
    },
  })
}
