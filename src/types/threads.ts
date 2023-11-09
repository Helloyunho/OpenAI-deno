import { CreateMessageParams, CreateMessageRawRequest } from './messages.ts'
import { HasMetadata } from './metadata.ts'

export interface ThreadRaw extends HasMetadata {
  id: string
  object: 'thread'
  created_at: number
}

export interface Thread extends HasMetadata {
  id: string
  object: 'thread'
  createdAt: number
}

export interface CreateThreadRawRequest extends HasMetadata {
  messages: CreateMessageRawRequest[]
}

export interface CreateThreadRequest extends HasMetadata {
  messages: CreateMessageParams[]
}
