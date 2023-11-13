import { CreateMessageParams, CreateMessageRawRequest } from './messages.ts'
import { HasMetadata } from './metadata.ts'

export interface ThreadRaw extends HasMetadata {
  id: string
  object: 'thread'
  created_at: number
}

export interface Thread extends HasMetadata {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string
  /**
   * The object type, which is always `thread`.
   */
  object: 'thread'
  /**
   * The Unix timestamp (in seconds) for when the thread was created.
   */
  createdAt: number
}

export interface CreateThreadRawRequest extends HasMetadata {
  messages?: CreateMessageRawRequest[]
}

export interface CreateThreadParams extends HasMetadata {
  /**
   * A list of [messages](https://platform.openai.com/docs/api-reference/messages) to start the thread with.
   */
  messages?: (CreateMessageParams & {
    /**
     * The role of the entity that is creating the message. Currently only `user` is supported.
     */
    role: 'user' | string
    /**
     * The content of the message.
     */
    content: string
  })[]
}
