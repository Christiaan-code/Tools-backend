const environment = {
  dev: 'dev',
  staging: 'staging',
  production: 'production',
} as const

export type IEnvironment = keyof typeof environment

export interface IEnvironmentObject {
  environment: IEnvironment
}

export interface IEncryptData {
  data: string
  production: boolean
}

export interface BulkEncryptRequest {
  type: 'bulk-one-way-encrypt'
  data: string[]
}

export interface BulkEncryptResponse {
  type: 'bulk-one-way-encrypt-result'
  original: string
  encrypted: string
}

export interface BulkEncryptProgress {
  type: 'bulk-one-way-encrypt-progress'
  processed: number
  total: number
}

export interface BulkEncryptStatus {
  type: 'bulk-one-way-encrypt-status'
  status: 'complete' | 'error'
  message?: string
}

export type SocketMessage =
  | BulkEncryptRequest
  | BulkEncryptResponse
  | BulkEncryptProgress
  | BulkEncryptStatus
