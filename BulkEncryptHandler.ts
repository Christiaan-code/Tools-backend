import { CryptoHandler } from './CryptoHandler'
import {
  BulkEncryptRequest,
  BulkEncryptResponse,
  BulkEncryptProgress,
  BulkEncryptStatus,
} from './models'

export class BulkEncryptHandler {
  static async handleBulkOneWayEncrypt(socket: any, message: BulkEncryptRequest) {
    try {
      const { data } = message
      const total = data.length

      if (!Array.isArray(data)) {
        throw new Error('Input must be an array of strings')
      }

      for (let i = 0; i < data.length; i++) {
        try {
          const item = data[i]

          if (typeof item !== 'string') {
            throw new Error('All items must be strings')
          }

          const encrypted = await CryptoHandler.OneWayEncrypt(item)

          const response: BulkEncryptResponse = {
            type: 'bulk-one-way-encrypt-result',
            original: item,
            encrypted: encrypted.toString(),
          }

          socket.emit('bulk-one-way-encrypt-result', response)

          // Send progress update
          const progress: BulkEncryptProgress = {
            type: 'bulk-one-way-encrypt-progress',
            processed: i + 1,
            total,
          }
          socket.emit('bulk-one-way-encrypt-progress', progress)
        } catch (error) {
          const status: BulkEncryptStatus = {
            type: 'bulk-one-way-encrypt-status',
            status: 'error',
            message: error.message,
          }
          socket.emit('bulk-one-way-encrypt-status', status)
        }
      }

      const status: BulkEncryptStatus = {
        type: 'bulk-one-way-encrypt-status',
        status: 'complete',
      }
      socket.emit('bulk-one-way-encrypt-status', status)
      socket.disconnect()
    } catch (error) {
      const status: BulkEncryptStatus = {
        type: 'bulk-one-way-encrypt-status',
        status: 'error',
        message: error.message,
      }
      socket.emit('bulk-one-way-encrypt-status', status)
      socket.disconnect()
    }
  }
}
