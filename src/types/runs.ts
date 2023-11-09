import { HasMetadata } from './metadata.ts'

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
