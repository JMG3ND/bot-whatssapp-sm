import qrcode from 'qrcode-terminal'

export default function printQrOnConsole(qr: string) {
  qrcode.generate(qr, { small: true })
}
