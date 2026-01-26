import client from './createWSClient';
import printQrOnConsole from '../core/onQR/printQrOnConsole';
import printReadyClient from '../core/onReady/printReadyClient';
import replyMessage from '../core/onMessageCreate/replyMessage';
import { controlErrors } from '../core/utils/controlErrors';

client.on('ready', printReadyClient);
client.on('qr', printQrOnConsole);
client.on('message_create', (message) => {
  controlErrors(async () => {
    await replyMessage(message);
  })
});

export default client;
