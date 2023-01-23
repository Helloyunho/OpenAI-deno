import { LimitedUsage, LimitedUsageRaw, LogProbs, LogProbsRaw } from './etc.ts'

export interface CompletionRawRequest {
  model: string
  prompt?: string | string[]
  suffix?: string
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
  user?: string
}

export interface CreateCompletionParams {
  /** The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.
   * Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.
   * @default '<|endoftext|>'
   */
  prompt?: string | string[]
  /** The suffix that comes after a completion of inserted text.
   * @default null
   */
  suffix?: string
  /** The maximum number of tokens to generate in the completion.
   * The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
   * @default 16
   */
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
  user?: string
}

export interface CompletionRawResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    text: string
    index: number
    logprobs?: LogProbsRaw
    finish_reason: string
  }[]
  usage: LimitedUsageRaw
}

export interface CreateCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    text: string
    index: number
    logprobs?: LogProbs
    finishReason: string
  }[]
  usage: LimitedUsage
}
