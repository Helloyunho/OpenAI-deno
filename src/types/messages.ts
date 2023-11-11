import { HasMetadata } from './metadata.ts'

export interface MessageRaw extends HasMetadata {
  id: string
  object: 'thread.message'
  created_at: number
  thread_id: string
  role: 'user' | 'assistant'
  content: (
    | {
        type: 'image_file'
        image_file: {
          file_id: string
        }
      }
    | {
        type: 'text'
        text: {
          value: string
          annotations: (
            | {
                type: 'file_citation'
                text: string
                file_citation: {
                  file_id: string
                  quote: string
                }
                start_index: number
                end_index: number
              }
            | {
                type: 'file_path'
                text: string
                file_path: {
                  file_id: string
                }
                start_index: number
                end_index: number
              }
          )[]
        }
      }
  )[]
  assistant_id: string | null
  run_id: string | null
  file_ids: string[]
}

export interface Message extends HasMetadata {
  id: string
  object: 'thread.message'
  createdAt: number
  threadID: string
  role: 'user' | 'assistant'
  content: (
    | {
        type: 'imageFile'
        fileID: string
      }
    | {
        type: 'text'
        value: string
        annotations: (
          | {
              type: 'fileCitation'
              text: string
              fileID: string
              quote: string
              startIndex: number
              endIndex: number
            }
          | {
              type: 'filePath'
              text: string
              fileID: string
              startIndex: number
              endIndex: number
            }
        )[]
      }
  )[]
  assistantID: string | null
  runID: string | null
  fileIDs: string[]
}

export interface CreateMessageRawRequest extends HasMetadata {
  role: 'user' | string
  content: string
  file_ids?: string[]
}

export interface CreateMessageParams extends HasMetadata {
  fileIDs?: string[]
}

export interface ListMessageQuery {
  limit: number
  order: 'desc' | 'asc'
  after: string
  before: string
}

export interface MessageFileRaw {
  id: string
  object: 'thread.message.file'
  created_at: number
  message_id: string
}

export interface MessageFile {
  id: string
  object: 'thread.message.file'
  createdAt: number
  messageID: string
}

export type ListMessageFileQuery = ListMessageQuery
