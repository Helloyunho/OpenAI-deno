import { HasMetadata } from './metadata.ts'
import { CreateThreadParams, CreateThreadRawRequest } from './threads.ts'

export interface RunRaw extends HasMetadata {
  id: string
  object: 'assistant.run'
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
        function: {
          description: string
          name: string
          parameters: Record<string, unknown>
        }
      }
  )[]
  file_ids: string[]
}

export interface Run extends HasMetadata {
  id: string
  object: 'assistant.run'
  createdAt: number
  threadID: string
  assistantID: string
  status:
    | 'queued'
    | 'inProgress'
    | 'requiresAction'
    | 'cancelling'
    | 'cancelled'
    | 'failed'
    | 'completed'
    | 'expired'
  requiredAction: {
    type: 'submitToolOutputs' | string
    submitToolOutputs: {
      toolCalls: {
        id: string
        type: 'function'
        function: {
          name: string
          arguments: string
        }
      }[]
    }
  } | null
  lastError: {
    code: 'serverError' | 'rateLimitExceeded' | string
    message: string
  } | null
  expiresAt: number
  startedAt: number | null
  cancelledAt: number | null
  failedAt: number | null
  completedAt: number | null
  model: string
  instructions: string
  tools: (
    | {
        type: 'codeInterpreter'
      }
    | {
        type: 'retrieval'
      }
    | {
        type: 'function'
        function: {
          description: string
          name: string
          parameters: Record<string, unknown>
        }
      }
  )[]
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
            function: {
              description: string
              name: string
              parameters: Record<string, unknown>
            }
          }
      )[]
    | null
}

export interface CreateRunParams extends HasMetadata {
  assistantID: string
  model?: string | null
  instructions?: string | null
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
            function: {
              description: string
              name: string
              parameters: Record<string, unknown>
            }
          }
      )[]
    | null
}

export interface ListRunQuery {
  limit: number
  order: 'desc' | 'asc'
  after: string
  before: string
}

export interface SubmitToolOutputsToRunRawRequest {
  tool_outputs: {
    tool_call_id: string
    output: string
  }[]
}

export interface ToolCall {
  id: string
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
  id: string
  object: 'thread.run.step'
  createdAt: number
  assistantID: string
  threadID: string
  runID: string
  type: 'messageCreation' | 'toolCalls' | string
  status: 'inProgress' | 'cancelled' | 'failed' | 'completed' | 'expired'
  stepDetails:
    | {
        type: 'messageCreation'
        messageID: string
      }
    | {
        type: 'toolCalls'
        toolCalls: (
          | {
              id: string
              type: 'codeInterpreter'
              input: string
              outputs: (
                | {
                    type: 'logs'
                    logs: string
                  }
                | {
                    type: 'image'
                    fileID: string
                  }
              )[]
            }
          | {
              id: string
              type: 'retrieval'
              retrieval: never
            }
          | {
              id: string
              type: 'function'
              name: string
              arguments: string
              output: string | null
            }
        )[]
      }
  lastError: {
    code: 'serverError' | 'rateLimitExceeded' | string
    message: string
  } | null
  expiresAt: number | null
  cancelledAt: number | null
  failedAt: number | null
  completedAt: number | null
}

export type ListRunStepsQuery = ListRunQuery
