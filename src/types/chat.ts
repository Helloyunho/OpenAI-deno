import { LimitedUsage, LimitedUsageRaw, LogProbs, LogProbsRaw } from './etc.ts'
import { FunctionRaw, Function } from './function.ts'

export interface ChatFunctionCallRaw {
  name: string
  arguments: string
}

export interface ChatFunctionCall {
  name: string
  arguments: Record<string, unknown>
}

export interface ChatFormatRaw {
  role: 'user' | 'assistant' | 'system' | 'function' | string
  content?: string
  name?: string
  function_call?: ChatFunctionCallRaw
}

export interface ChatFormat {
  /** The role of the messages author. One of `system`, `user`, `assistant`, or `function`. */
  role: 'user' | 'assistant' | 'system' | 'function' | string
  /** The contents of the message. `content` is required for all messages except assistant messages with function calls. */
  content?: string
  /** The name of the author of this message. `name` is required if role is `function`, and it should be the name of the function whose response is in the `content`. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters. */
  name?: string
  /** The name and arguments of a function that should be called, as generated by the model. */
  functionCall?: ChatFunctionCall
}

export interface CreateChatRawRequest {
  model: string
  messages: ChatFormatRaw[]
  functions?: FunctionRaw[]
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
  functions?: Function[]
  /**
   * Controls how the model responds to function calls. "none" means the model does not call a function, and responds to the end-user. "auto" means the model can pick between an end-user or calling a function. Specifying a particular function via `{"name":\ "my_function"}` forces the model to call that function. "none" is the default when no functions are present. "auto" is the default if functions are present.
   */
  functionCall?: ChatFunctionCall | string
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
   * How many chat completion choices to generate for each input message.
   */
  count?: number
  // stream?: boolean
  /**
   * Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
   */
  stop?: string | string[] | null
  /** The maximum number of [tokens](https://platform.openai.com/tokenizer) to generate in the completion.
   * The total length of input tokens and generated tokens is limited by the model's context length. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.
   */
  maxTokens?: number
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
   * Modify the likelihood of specified tokens appearing in the completion.

   * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
   */
  logitBias?: { [key: string]: number } | null
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
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
