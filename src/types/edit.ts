import { LimitedUsage, LimitedUsageRaw, LogProbs, LogProbsRaw } from './etc.ts'

export interface CreateEditRawRequest {
  model: string
  input?: string
  instruction: string
  n?: number
  temperature?: number
  top_p?: number
}

export interface CreateEditRawResponse {
  object: string
  created: number
  choices: {
    text: string
    index: number
    logprobs?: LogProbsRaw
    finish_reason: string
  }[]
  usage: LimitedUsageRaw
}

export interface CreateEditParams {
  input?: string
  n?: number
  temperature?: number
  topP?: number
}

export interface CreateEditResponse {
  object: string
  created: number
  choices: {
    text: string
    index: number
    logprobs?: LogProbs
    finishReason: string
  }[]
  usage: LimitedUsage
}
