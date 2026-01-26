import client from './createWSClient';
import printQrOnConsole from '../core/onQR/printQrOnConsole';
import printReadyClient from '../core/onReady/printReadyClient';
import replyMessage from '../core/onMessageCreate/replyMessage';

client.on('ready', printReadyClient);
client.on('qr', printQrOnConsole);
client.on('message_create', replyMessage);

export default client;