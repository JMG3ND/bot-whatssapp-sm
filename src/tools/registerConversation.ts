import { prisma } from '../database'

interface RegisterConversationProps {
  user: string
  user_message: string
  bot_response: string
}

export async function registerConversation(registerConversationProps: RegisterConversationProps) {
  const { user, user_message, bot_response } = registerConversationProps
  return await prisma.conversation.create({
    data: {
      user: user,
      user_message: user_message,
      bot_response: bot_response,
    },
  })
}
