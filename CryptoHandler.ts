import * as crypto from 'crypto'
import { IEncryptData } from './models'

export class CryptoHandler {

  public static encrypt(inputData: IEncryptData): string {
    const { data, production } = inputData

    if (data) {
      const iv = crypto.randomBytes(16)
      const mykey = crypto.createCipheriv('aes-256-cbc', this.getCryptoKey(production), iv)
      const mystr = mykey.update(data)
      const encrypted = Buffer.concat([mystr, mykey.final()])
      const encryptedCombined = iv.toString('hex') + ':' + encrypted.toString('hex')
      return encryptedCombined
    }
    return data
  }

  public static decrypt(inputData: IEncryptData): string {
    const { data, production } = inputData
    if (data) {
      const textParts = data.split(':')
      const iv = Buffer.from(textParts.shift(), 'hex')
      const encryptedText = Buffer.from(textParts.join(':'), 'hex')
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.getCryptoKey(production), iv)
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

  private static getCryptoKey(production: boolean): Buffer {
    if (production)
      return Buffer.from(process.env.PROD_CRYPTO_PASSWORD)
    else
      return Buffer.from(process.env.CRYPTO_PASSWORD)
  }
}
