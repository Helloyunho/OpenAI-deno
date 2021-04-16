export interface AnswerRawRequest {
  model: string
  question: string
  examples?: [string, string][]
  examples_context?: string
  documents?: string[]
  file?: string
  search_model?: string
  max_rerank?: number
  temperature?: number
  logprobs?: number | null
  max_tokens?: number
  logit_bias?: { [key: string]: number } | null
  stop?: string | string[] | null
  n?: number
  return_prompt?: boolean
  return_metadata?: boolean
  expend?: string[]
}

export interface AnswerArgs {
  question: string
  examples: [string, string][]
  examplesContext: string
  documents?: string[]
  file?: string
  searchModel?: string
  maxRerank?: number
  temperature?: number
  logprobs?: number | null
  maxTokens?: number
  logitBias?: { [key: string]: number } | null
  stop?: string | string[] | null
  count?: number
  returnPrompt?: boolean
  returnMetadata?: boolean
  expend?: string[]
}

export interface AnswerRawResponse {
  answers: string[]
  completion: string
  model: string
  search_model: string
  selected_documents: {
    document: number
    text: string
  }[]
}

export interface AnswerResponse {
  answers: string[]
  completion: string
  model: string
  searchModel: string
  selectedDocuments: {
    document: number
    text: string
  }[]
}
