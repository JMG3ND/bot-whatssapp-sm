import type { Message } from 'whatsapp-web.js'
import responseMessage from '../../agent/responseMessage';
import { validateCommand } from '../comands/validateComands';
import { readPrompt } from '../../utils/readPrompt';
import { readUserId } from '../../utils/readUser';
import { registerConversation } from '../../../tools';
import { getUserConversation } from '../../../tools/functions/getUserConversation';

export async function replyConversation(message: Message) {
  if (!validateCommand(message.body)) return
  const user = readUserId(message);
  const newMessage = readPrompt(message.body);
  const conversation = await getUserConversation(user, newMessage);
  const aiResponse = await responseMessage(conversation);
  await registerConversation({
    user: user,
    user_message: newMessage,
    bot_response: aiResponse,
  });
  await message.reply(aiResponse);
}
