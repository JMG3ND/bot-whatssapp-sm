export function addMessageToConversation(conversation: string, messageToAdd: string) {
  return `${conversation} ${messageToAdd ? '\n' + messageToAdd : '' }`
}
