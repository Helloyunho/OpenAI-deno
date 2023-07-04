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
  /**
   * The input text to use as a starting point for the edit.
   */
  input?: string
  /**
   * How many edits to generate for the input and instruction.
   */
  count?: number
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
