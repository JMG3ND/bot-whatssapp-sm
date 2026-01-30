import { brainConnection } from '@database/index'

interface RegisterConversationProps {
  chat: string
  userName: string
  user_message: string
  bot_response: string
}

export async function registerConversation(registerConversationProps: RegisterConversationProps) {
  const { chat, userName, user_message, bot_response } = registerConversationProps
  return await brainConnection.conversation.create({
    data: {
      chat: chat,
      userName: userName,
      user_message: user_message,
      bot_response: bot_response,
    },
  })
}
