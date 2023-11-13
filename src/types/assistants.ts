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
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string
  /**
   * The object type, which is always `assistant`.
   */
  object: 'assistant'
  /**
   * The Unix timestamp (in seconds) for when the assistant was created.
   */
  createdAt: number
  /**
   * The name of the assistant. The maximum length is 256 characters.
   */
  name: string | null
  /**
   * The description of the assistant. The maximum length is 512 characters.
   */
  description: string | null
  /**
   * ID of the model to use.
   *
   * You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models,
   * or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.
   */
  model: string
  /**
   * The system instructions that the assistant uses. The maximum length is 32768 characters.
   */
  instructions: string | null
  /**
   * A list of tool enabled on the assistant.
   *
   * There can be a maximum of 128 tools per assistant.
   *
   * Tools can be of types `codeInterpreter`, `retrieval`, or `function`.
   */
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
  /**
   * A list of [file](https://platform.openai.com/docs/api-reference/files) IDs attached to this assistant.
   *
   * There can be a maximum of 20 files attached to the assistant.
   *
   * Files are ordered by their creation date in ascending order.
   */
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
  /**
   * The name of the assistant. The maximum length is 256 characters.
   */
  name?: string | null
  /**
   * The description of the assistant. The maximum length is 512 characters.
   */
  description?: string | null
  /**
   * The system instructions that the assistant uses. The maximum length is 32768 characters.
   */
  instructions?: string | null
  /**
   * A list of tool enabled on the assistant.
   *
   * There can be a maximum of 128 tools per assistant.
   *
   * Tools can be of types `codeInterpreter`, `retrieval`, or `function`.
   */
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
  /**
   * A list of [file](https://platform.openai.com/docs/api-reference/files) IDs attached to this assistant.
   *
   * There can be a maximum of 20 files attached to the assistant.
   *
   * Files are ordered by their creation date in ascending order.
   */
  fileIDs?: string[]
}

export type ModifyAssistantRawRequest = Partial<CreateAssistantRawRequest>
export interface ModifyAssistantParams extends Partial<CreateAssistantParams> {
  model?: string
}

export interface ListAssistantQuery {
  /**
   * A limit on the number of objects to be returned.
   * Limit can range between 1 and 100, and the default is 20.
   */
  limit?: number
  /**
   * Sort order by the `created_at` timestamp of the objects.
   * `asc` for ascending order and `desc` for descending order.
   */
  order?: 'desc' | 'asc'
  /**
   * A cursor for use in pagination.
   *
   * `after` is an object ID that defines your place in the list.
   * For instance, if you make a list request and receive 100 objects,
   * ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.
   */
  after?: string
  /**
   * A cursor for use in pagination.
   *
   * `before` is an object ID that defines your place in the list.
   * For instance, if you make a list request and receive 100 objects,
   * ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.
   */
  before?: string
}

export interface AssistantFileRaw {
  id: string
  object: 'assistant.file'
  created_at: number
  assistant_id: string
}

export interface AssistantFile {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string
  /**
   * The object type, which is always `assistant.file`.
   */
  object: 'assistant.file'
  /**
   * The Unix timestamp (in seconds) for when the assistant file was created.
   */
  createdAt: number
  /**
   * The assistant ID that the file is attached to.
   */
  assistantID: string
}

export type ListAssistantFileQuery = ListAssistantQuery
