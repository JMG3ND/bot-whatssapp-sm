import { brainConnection } from '@database/brainConnection'

export async function clearConversation(chat: string) {
  await brainConnection.conversation.deleteMany({
    where: {
      chat: chat,
    },
  })
}
