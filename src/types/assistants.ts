import { Function, FunctionRaw } from './function.ts'
import { HasMetadata } from './metadata.ts'

export interface AssistantRaw extends HasMetadata {
  id: string
  object: 'assistant'
  created_at: number
  name: string | null
  description: string | null
  model: string
  instructions: string | null
  tools: (
    | {
        type: 'code_interpreter' // maybe in the future they add more properties to this object
      }
    | {
        type: 'retrieval'
      }
    | {
        type: 'function'
        function: FunctionRaw
      }
  )[]
  file_ids: string[]
}

export interface Assistant extends HasMetadata {
  id: string
  object: 'assistant'
  createdAt: number
  name: string | null
  description: string | null
  model: string
  instructions: string | null
  tools: (
    | {
        type: 'codeInterpreter'
      }
    | {
        type: 'retrieval'
      }
    | {
        type: 'function'
        function: Function
      }
  )[]
  fileIDs: string[]
}

export interface CreateAssistantRawRequest extends HasMetadata {
  model: string
  name?: string | null
  description?: string | null
  instructions?: string | null
  tools?: (
    | {
        type: 'code_interpreter'
      }
    | {
        type: 'retrieval'
      }
    | {
        type: 'function'
        function: FunctionRaw
      }
  )[]
  file_ids?: string[]
}

export interface CreateAssistantParams extends HasMetadata {
  name?: string | null
  description?: string | null
  instructions?: string | null
  tools?: (
    | {
        type: 'codeInterpreter'
      }
    | {
        type: 'retrieval'
      }
    | {
        type: 'function'
        function: Function
      }
  )[]
  fileIDs?: string[]
  metadata?: Record<string, unknown>
}

export type ModifyAssistantRawRequest = Partial<CreateAssistantRawRequest>
export interface ModifyAssistantParams extends Partial<CreateAssistantParams> {
  model?: string
}

export interface ListAssistantQuery {
  limit?: number
  order?: 'desc' | 'asc'
  after?: string
  before?: string
}

export interface AssistantFileRaw {
  id: string
  object: 'assistant.file'
  created_at: number
  assistant_id: string
}

export interface AssistantFile {
  id: string
  object: 'assistant.file'
  createdAt: number
  assistantID: string
}

export type ListAssistantFileQuery = ListAssistantQuery
