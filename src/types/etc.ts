export interface LimitedUsageRaw {
  prompt_tokens: number
  completion_tokens?: number
  total_tokens: number
}

export interface LimitedUsage {
  promptTokens: number
  completionTokens?: number
  totalTokens: number
}

export interface LogProbsRaw {
  tokens: string[]
  token_logprobs: number[]
  text_offset: number[]
  top_logprobs: Record<string, unknown>[]
}

export interface LogProbs {
  tokens: string[]
  tokenLogprobs: number[]
  textOffset: number[]
  topLogprobs: Record<string, unknown>[]
}

export interface DeleteResponse {
  id: string
  object: string
  deleted: boolean
}
