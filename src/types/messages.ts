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
  assistant_id?: string | null
  run_id?: string | null
  file_ids: string[]
}

export interface Message extends HasMetadata {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string
  /**
   * The object type, which is always `thread.message`.
   */
  object: 'thread.message'
  /**
   * The Unix timestamp (in seconds) for when the message was created.
   */
  createdAt: number
  /**
   * The [thread](https://platform.openai.com/docs/api-reference/threads) ID that this message belongs to.
   */
  threadID: string
  /**
   * The entity that produced the message. One of `user` or `assistant`.
   */
  role: 'user' | 'assistant'
  /**
   * The content of the message in array of text and/or images.
   */
  content: (
    | {
        type: 'imageFile'
        /**
         * The [File](https://platform.openai.com/docs/api-reference/files) ID of the image in the message content.
         */
        fileID: string
      }
    | {
        type: 'text'
        /**
         * The data that makes up the text.
         */
        value: string
        annotations: (
          | {
              type: 'fileCitation'
              /**
               * The text in the message content that needs to be replaced.
               */
              text: string
              /**
               * The ID of the specific File the citation is from.
               */
              fileID: string
              /**
               * The specific quote in the file.
               */
              quote: string
              startIndex: number
              endIndex: number
            }
          | {
              type: 'filePath'
              /**
               * The text in the message content that needs to be replaced.
               */
              text: string
              /**
               * The ID of the file that was generated.
               */
              fileID: string
              startIndex: number
              endIndex: number
            }
        )[]
      }
  )[]
  /**
   * If applicable, the ID of the [assistant](https://platform.openai.com/docs/api-reference/assistants) that authored this message.
   */
  assistantID?: string | null
  /**
   * If applicable, the ID of the run associated with the authoring of this message.
   */
  runID?: string | null
  /**
   * A list of [file](https://platform.openai.com/docs/api-reference/files) IDs that the assistant should use.
   *
   * Useful for tools like `retrieval` and `codeInterpreter` that can access files.
   *
   * A maximum of 10 files can be attached to a message.
   */
  fileIDs: string[]
}

export interface CreateMessageRawRequest extends HasMetadata {
  role: 'user' | string
  content: string
  file_ids?: string[]
}

export interface CreateMessageParams extends HasMetadata {
  /**
   * A list of [File](https://platform.openai.com/docs/api-reference/files) IDs that the message should use.
   *
   * There can be a maximum of 10 files attached to a message.
   *
   * Useful for tools like `retrieval` and `code_interpreter` that can access and use files.
   */
  fileIDs?: string[]
}

export interface ListMessageQuery {
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

export interface MessageFileRaw {
  id: string
  object: 'thread.message.file'
  created_at: number
  message_id: string
}

export interface MessageFile {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string
  /**
   * The object type, which is always `thread.message.file`.
   */
  object: 'thread.message.file'
  /**
   * The Unix timestamp (in seconds) for when the message file was created.
   */
  createdAt: number
  /**
   * The ID of the [message](https://platform.openai.com/docs/api-reference/messages) that the [File](https://platform.openai.com/docs/api-reference/files) is attached to.
   */
  messageID: string
}

export type ListMessageFileQuery = ListMessageQuery
