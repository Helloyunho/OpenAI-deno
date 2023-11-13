import { FunctionRaw, Function } from './function.ts'
import { HasMetadata } from './metadata.ts'
import { CreateThreadParams, CreateThreadRawRequest } from './threads.ts'

export interface RunRaw extends HasMetadata {
  id: string
  object: 'thread.run'
  created_at: number
  thread_id: string
  assistant_id: string
  status:
    | 'queued'
    | 'in_progress'
    | 'requires_action'
    | 'cancelling'
    | 'cancelled'
    | 'failed'
    | 'completed'
    | 'expired'
  required_action: {
    type: 'submit_tool_outputs' | string
    submit_tool_outputs: {
      tool_calls: {
        id: string
        type: 'function'
        function: {
          name: string
          arguments: string
        }
      }[]
    }
  } | null
  last_error: {
    code: 'server_error' | 'rate_limit_exceeded' | string
    message: string
  } | null
  expires_at: number
  started_at: number | null
  cancelled_at: number | null
  failed_at: number | null
  completed_at: number | null
  model: string
  instructions: string
  tools: (
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
  file_ids: string[]
}

export interface Run extends HasMetadata {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string
  /**
   * The object type, which is always `thread.run`.
   */
  object: 'thread.run'
  /**
   * The Unix timestamp (in seconds) for when the run was created.
   */
  createdAt: number
  /**
   * The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) that was executed on as a part of this run.
   */
  threadID: string
  /**
   * The ID of the [assistant](https://platform.openai.com/docs/api-reference/assistants) used for execution of this run.
   */
  assistantID: string
  /**
   * The status of the run, which can be either `queued`, `inProgress`, `requiresAction`, `cancelling`, `cancelled`, `failed`, `completed`, or `expired`.
   */
  status:
    | 'queued'
    | 'inProgress'
    | 'requiresAction'
    | 'cancelling'
    | 'cancelled'
    | 'failed'
    | 'completed'
    | 'expired'
  /**
   * Details on the action required to continue the run. Will be `null` if no action is required.
   */
  requiredAction: {
    /**
     * For now, this is always `submit_tool_outputs`.
     */
    type: 'submitToolOutputs' | string
    /**
     * Details on the tool outputs needed for this run to continue.
     */
    submitToolOutputs: {
      /**
       * A list of the relevant tool calls.
       */
      toolCalls: {
        /**
         * The ID of the tool call.
         *
         * This ID must be referenced when you submit the tool outputs in using the [Submit tool outputs to run](https://platform.openai.com/docs/api-reference/runs/submitToolOutputs) endpoint.
         */
        id: string
        /**
         * The type of tool call the output is required for. For now, this is always `function`.
         */
        type: 'function' | string
        /**
         * The function definition.
         */
        function: {
          /**
           * The name of the function.
           */
          name: string
          /**
           * The arguments that the model expects you to pass to the function.
           */
          arguments: string
        }
      }[]
    }
  } | null
  /**
   * The last error associated with this run. Will be `null` if there are no errors.
   */
  lastError: {
    /**
     * One of `server_error` or `rate_limit_exceeded`.
     */
    code: 'serverError' | 'rateLimitExceeded' | string
    /**
     * A human-readable description of the error.
     */
    message: string
  } | null
  /**
   * The Unix timestamp (in seconds) for when the run will expire.
   */
  expiresAt: number
  /**
   * The Unix timestamp (in seconds) for when the run was started.
   */
  startedAt: number | null
  /**
   * The Unix timestamp (in seconds) for when the run was cancelled.
   */
  cancelledAt: number | null
  /**
   * The Unix timestamp (in seconds) for when the run failed.
   */
  failedAt: number | null
  /**
   * The Unix timestamp (in seconds) for when the run was completed.
   */
  completedAt: number | null
  /**
   * The model that the [assistant](https://platform.openai.com/docs/api-reference/assistants) used for this run.
   */
  model: string
  /**
   * The instructions that the [assistant](https://platform.openai.com/docs/api-reference/assistants) used for this run.
   */
  instructions: string
  /**
   * The list of tools that the [assistant](https://platform.openai.com/docs/api-reference/assistants) used for this run.
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
   * The list of [File](https://platform.openai.com/docs/api-reference/files) IDs the [assistant](https://platform.openai.com/docs/api-reference/assistants) used for this run.
   */
  fileIDs: string[]
}

export interface CreateRunRawRequest extends HasMetadata {
  assistant_id: string
  model?: string | null
  instructions?: string | null
  tools?:
    | (
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
    | null
}

export interface CreateRunParams extends HasMetadata {
  /**
   * The ID of the [Model](https://platform.openai.com/docs/api-reference/models) to be used to execute this run.
   *
   * If a value is provided here, it will override the model associated with the assistant.
   * If not, the model associated with the assistant will be used.
   */
  model?: string | null
  /**
   * Override the default system message of the assistant. This is useful for modifying the behavior on a per-run basis.
   */
  instructions?: string | null
  /**
   * Override the tools the assistant can use for this run. This is useful for modifying the behavior on a per-run basis.
   */
  tools?:
    | (
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
    | null
}

export interface ListRunQuery {
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

export interface SubmitToolOutputsToRunRawRequest {
  tool_outputs: {
    tool_call_id: string
    output: string
  }[]
}

export interface ToolCall {
  /**
   * The ID of the tool call in the `requiredAction` object within the run object the output is being submitted for.
   */
  id: string
  /**
   * The output of the tool call to be submitted to continue the run.
   */
  output: string
}

export interface CreateThreadAndRunRawRequest extends CreateRunRawRequest {
  thread: CreateThreadRawRequest
}

export interface CreateThreadAndRunParams extends CreateRunParams {
  thread: CreateThreadParams
}

export interface RunStepRaw extends HasMetadata {
  id: string
  object: 'thread.run.step'
  created_at: number
  assistant_id: string
  thread_id: string
  run_id: string
  type: 'message_creation' | 'tool_calls' | string
  status: 'in_progress' | 'cancelled' | 'failed' | 'completed' | 'expired'
  step_details:
    | {
        type: 'message_creation'
        message_creation: {
          message_id: string
        }
      }
    | {
        type: 'tool_calls'
        tool_calls: (
          | {
              id: string
              type: 'code_interpreter'
              code_interpreter: {
                input: string
                outputs: (
                  | {
                      type: 'logs'
                      logs: string
                    }
                  | {
                      type: 'image'
                      image: {
                        file_id: string
                      }
                    }
                )[]
              }
            }
          | {
              id: string
              type: 'retrieval'
              retrieval: never
            }
          | {
              id: string
              type: 'function'
              function: {
                name: string
                arguments: string
                output: string | null
              }
            }
        )[]
      }
  last_error: {
    code: 'server_error' | 'rate_limit_exceeded' | string
    message: string
  } | null
  expires_at: number | null
  cancelled_at: number | null
  failed_at: number | null
  completed_at: number | null
}

export interface RunStep extends HasMetadata {
  /**
   * The identifier of the run step, which can be referenced in API endpoints.
   */
  id: string
  /**
   * The object type, which is always `thread.run.step`.
   */
  object: 'thread.run.step'
  /**
   * The Unix timestamp (in seconds) for when the run step was created.
   */
  createdAt: number
  /**
   * The ID of the [assistant](https://platform.openai.com/docs/api-reference/assistants) associated with the run step.
   */
  assistantID: string
  /**
   * The ID of the [thread](https://platform.openai.com/docs/api-reference/threads) that was run.
   */
  threadID: string
  /**
   * The ID of the [run](https://platform.openai.com/docs/api-reference/runs) that this run step is a part of.
   */
  runID: string
  /**
   * The type of run step, which can be either `messageCreation` or `toolCalls`.
   */
  type: 'messageCreation' | 'toolCalls' | string
  /**
   * The status of the run step, which can be either `inProgress`, `cancelled`, `failed`, `completed`, or `expired`.
   */
  status: 'inProgress' | 'cancelled' | 'failed' | 'completed' | 'expired'
  /**
   * The details of the run step.
   */
  stepDetails:
    | {
        type: 'messageCreation'
        /**
         * The ID of the message that was created by this run step.
         */
        messageID: string
      }
    | {
        type: 'toolCalls'
        /**
         * An array of tool calls the run step was involved in.
         * These can be associated with one of three types of tools: `codeInterpreter`, `retrieval`, or `function`.
         */
        toolCalls: (
          | {
              /**
               * The ID of the tool call.
               */
              id: string
              type: 'codeInterpreter'
              /**
               * The input to the Code Interpreter tool call.
               */
              input: string
              /**
               * The outputs from the Code Interpreter tool call.
               *
               * Code Interpreter can output one or more items,
               * including text (`logs`) or images (`image`).
               *
               * Each of these are represented by a different object type.
               */
              outputs: (
                | {
                    type: 'logs'
                    /**
                     * The text output from the Code Interpreter tool call.
                     */
                    logs: string
                  }
                | {
                    type: 'image'
                    /**
                     * The [file](https://platform.openai.com/docs/api-reference/files) ID of the image.
                     */
                    fileID: string
                  }
              )[]
            }
          | {
              /**
               * The ID of the tool call object.
               */
              id: string
              type: 'retrieval'
              /**
               * For now, this is always going to be an empty object.
               */
              retrieval: never
            }
          | {
              /**
               * The ID of the tool call object.
               */
              id: string
              type: 'function'
              /**
               * The name of the function.
               */
              name: string
              /**
               * The arguments passed to the function.
               */
              arguments: string
              /**
               * The output of the function. This will be `null` if the outputs have not been [submitted](https://platform.openai.com/docs/api-reference/runs/submitToolOutputs) yet.
               */
              output: string | null
            }
        )[]
      }
  /**
   * The last error associated with this run step. Will be `null` if there are no errors.
   */
  lastError: {
    /**
     * One of `serverError` or `rateLimitExceeded`.
     */
    code: 'serverError' | 'rateLimitExceeded' | string
    /**
     * A human-readable description of the error.
     */
    message: string
  } | null
  /**
   * The Unix timestamp (in seconds) for when the run step expired. A step is considered expired if the parent run is expired.
   */
  expiresAt: number | null
  /**
   * The Unix timestamp (in seconds) for when the run step was cancelled.
   */
  cancelledAt: number | null
  /**
   * The Unix timestamp (in seconds) for when the run step failed.
   */
  failedAt: number | null
  /**
   * The Unix timestamp (in seconds) for when the run step completed.
   */
  completedAt: number | null
}

export type ListRunStepsQuery = ListRunQuery
