export interface ClassificationRawRequest {
  model: string
  query: string
  examples?: [string, string][]
  file?: string
  labels?: string[] | null
  search_model?: string
  temperature?: number
  logprobs?: number | null
  max_examples?: number
  logit_bias?: { [key: string]: number } | null
  return_prompt?: boolean
  return_metadata?: boolean
  expend?: string[]
}

export interface ClassificationArgs {
  query: string
  examples?: [string, string][]
  file?: string
  labels?: string[] | null
  searchModel?: string
  temperature?: number
  logprobs?: number | null
  maxExamples?: number
  logitBias?: { [key: string]: number } | null
  returnPrompt?: boolean
  returnMetadata?: boolean
  expend?: string[]
}

export interface ClassificationRawResponse {
  completion: string
  label: string
  model: string
  search_model: string
  selected_examples: {
    document: number
    label: string
    text: string
  }[]
}

export interface ClassificationResponse {
  completion: string
  label: string
  model: string
  searchModel: string
  selectedExamples: {
    document: number
    label: string
    text: string
  }[]
}
