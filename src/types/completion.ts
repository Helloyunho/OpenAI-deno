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
   */
  prompt?: string | string[]
  /** The suffix that comes after a completion of inserted text.
   */
  suffix?: string
  /** The maximum number of [tokens](https://platform.openai.com/tokenizer) to generate in the completion.

   * The token count of your prompt plus `max_tokens` cannot exceed the model's context length. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.
   */
  maxTokens?: number
  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

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
   * Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.

   * The maximum value for `logprobs` is 5.
   */
  logprobs?: number | null
  /**
   * Echo back the prompt in addition to the completion
   */
  echo?: boolean
  /**
   * Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
   */
  stop?: string | string[] | null
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

   * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)
   */
  presencePenalty?: number
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

   * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)
   */
  frequencyPenalty?: number
  /**
   * Generates `best_of` completions server-side and returns the "best" (the one with the highest log probability per token). Results cannot be streamed.

   * When used with `count`, `best_of` controls the number of candidate completions and `count` specifies how many to return – `best_of` must be greater than `count`.

   * @note Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
   */
  bestOf?: number
  /**
   * Modify the likelihood of specified tokens appearing in the completion.

   * Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this [tokenizer tool](https://platform.openai.com/tokenizer?view=bpe) (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

   * As an example, you can pass {"50256": -100} to prevent the <|endoftext|> token from being generated.
   */
  logitBias?: { [key: string]: number } | null
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
   */
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
