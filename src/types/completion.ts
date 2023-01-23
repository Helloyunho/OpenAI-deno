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
  /**
   * What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.

   * OpenAI generally recommend altering this or `topP` but not both.
   */
  temperature?: number
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

   * OpenAI generally recommend altering this or `temperature` but not both.
   */
  topP?: number
  /**
   * How many completions to generate for each prompt.

   * @note Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `maxTokens` and `stop`.
   */
  count?: number
  // stream?: boolean
  /**
   * Include the log probabilities on the logprobs most likely tokens, as well the chosen tokens. For example, if logprobs is 5, the API will return a list of the 5 most likely tokens. The API will always return the logprob of the sampled token, so there may be up to logprobs+1 elements in the response.

The maximum value for logprobs is 5. If you need more than this, please contact us through our Help center and describe your use case.
   */
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
