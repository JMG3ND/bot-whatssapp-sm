import { brainConnection } from '@database/brainConnection'

export async function clearConversation(user: string) {
  await brainConnection.conversation.deleteMany({
    where: {
      user: user,
    },
  })
}
