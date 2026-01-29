import qrcode from 'qrcode-terminal'

/**
 * Imprime el código QR generado por el cliente de whatsapp-web.js en la consola
 * @param qr Código QR en formato string
 */
export function printQrOnConsole(qr: string) {
  qrcode.generate(qr, { small: true })
}
