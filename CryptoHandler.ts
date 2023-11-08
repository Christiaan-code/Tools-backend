import * as crypto from 'crypto'

export class CryptoHandler {

  public static encrypt(data: string): string {
    if (data) {
      const iv = crypto.randomBytes(16)
      const mykey = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_PASSWORD), iv)
      const mystr = mykey.update(data)
      const encrypted = Buffer.concat([mystr, mykey.final()])
      const encryptedCombined = iv.toString('hex') + ':' + encrypted.toString('hex')
      return encryptedCombined
    }
    return data
  }

  public static decrypt(data: string): string {
    if (data) {
      const textParts = data.split(':')
      console.log('text: ', textParts)
      const iv = Buffer.from(textParts.shift(), 'hex')
      console.log('iv: ', iv)
      const encryptedText = Buffer.from(textParts.join(':'), 'hex')
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_PASSWORD), iv)
      const decrypted = decipher.update(encryptedText)

      const decryptedValue = Buffer.concat([decrypted, decipher.final()])

      return decryptedValue.toString()
    }
    return data
  }

  public static OneWayEncrypt(input): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        input,
        process.env.ONE_WAY_CRYPTO_PASSWORD,
        1000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) {
            reject(err)
          }
          resolve(derivedKey.toString('hex'))
        })
    })
  }

}
