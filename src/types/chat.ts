import { LimitedUsage, LimitedUsageRaw, LogProbs, LogProbsRaw } from './etc.ts'

export interface ChatFunctionCallRaw {
  name: string
  arguments: string
}

export interface ChatFunctionCall {
  name: string
  arguments: Record<string, unknown>
}

export interface ChatFormatRaw {
  role: 'user' | 'assistant' | 'system' | string
  content?: string
  name?: string
  function_call?: ChatFunctionCallRaw
}

export interface ChatFormat {
  role: 'user' | 'assistant' | 'system' | string
  content?: string
  name?: string
  functionCall?: ChatFunctionCall
}

export interface ChatFunctionRaw {
  name: string
  description?: string
  parameters?: Record<string, unknown>
}

export interface ChatFunction {
  name: string
  description?: string
  parameters?: Record<string, unknown>
}

export interface CreateChatRawRequest {
  model: string
  messages: ChatFormatRaw[]
  functions?: ChatFunctionRaw[]
  function_call?: ChatFunctionCallRaw | string
  temperature?: number
  top_p?: number
  n?: number
  // stream?: boolean
  stop?: string | string[] | null
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  logit_bias?: { [key: string]: number } | null
  user?: string
}

export interface CreateChatParams {
  /**
   * A list of functions the model may generate JSON inputs for.
   */
  functions?: ChatFunction[]
  /**
   * Controls how the model responds to function calls. "none" means the model does not call a function, and responds to the end-user. "auto" means the model can pick between an end-user or calling a function. Specifying a particular function via `{"name":\ "my_function"}` forces the model to call that function. "none" is the default when no functions are present. "auto" is the default if functions are present.
   */
  functionCall?: ChatFunctionCall | string
  /**
   * What [sampling temperature](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277) to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.

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
   * Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
   */
  stop?: string | string[] | null
  /** The maximum number of tokens to generate in the completion.
   * The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
   */
  maxTokens?: number
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

[See more information about frequency and presence penalties.](https://beta.openai.com/docs/api-reference/parameter-details)
   */
  presencePenalty?: number
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

[See more information about frequency and presence penalties.](https://beta.openai.com/docs/api-reference/parameter-details)
   */
  frequencyPenalty?: number
  /**
   * Modify the likelihood of specified tokens appearing in the completion.

Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this [tokenizer tool](https://beta.openai.com/tokenizer?view=bpe) (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

As an example, you can pass {"50256": -100} to prevent the <|endoftext|> token from being generated.
   */
  logitBias?: { [key: string]: number } | null
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://beta.openai.com/docs/guides/safety-best-practices/end-user-ids).
   */
  user?: string
}

export interface CreateChatRawResponse {
  id: string
  object: string
  created: number
  choices: {
    message: ChatFormatRaw
    index: number
    logprobs?: LogProbsRaw
    finish_reason: string
  }[]
  usage: LimitedUsageRaw
}

export interface CreateChatResponse {
  id: string
  object: string
  created: number
  choices: {
    message: ChatFormat
    index: number
    logprobs?: LogProbs
    finishReason: string
  }[]
  usage: LimitedUsage
}
