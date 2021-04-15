export interface CompletionRawRequest {
  prompt?: string | string[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  n?: number
  // stream?: boolean // needs event listener implementation
  logprobs?: number | null
  echo?: boolean
  stop?: string | string[] | null
  presence_penalty?: number
  frequency_penalty?: number
  best_of?: number
  logit_bias?: { [key: string]: number } | null
}

export interface CompletionArgs {
  prompt?: string | string[]
  maxTokens?: number
  temperature?: number
  topP?: number
  count?: number
  // stream?: boolean
  logprobs?: number | null
  echo?: boolean
  stop?: string | string[] | null
  presencePenalty?: number
  frequencyPenalty?: number
  bestOf?: number
  logitBias?: { [key: string]: number } | null
}

export interface CompletionRawResponse {
  id: string
  created: number
  model: string
  choices: {
    text: string
    index: number
    logprobs: number | null
    finish_reason: string
  }[]
}

export interface CompletionResponse {
  id: string
  created: number
  model: string
  choices: {
    text: string
    index: number
    logprobs: number | null
    finishReason: string
  }[]
}
