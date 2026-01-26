import type { Message } from 'whatsapp-web.js'
import responseMessage from '../agent/responseMessage';

const regComand = /^\/ai\b/i;

export default async function replyMessage(message: Message) {
  if(regComand.test(message.body)){
    const prompt = message.body.replace(regComand, '').trim()
    const aiResponse = await responseMessage(prompt);
    await message.reply(aiResponse);
  }
}
