export interface SearchRawRequest {
  documents?: string[]
  file?: string
  query: string
  max_rerank?: number
  return_metadata?: boolean
}

export interface SearchArgs {
  documents?: string[]
  file?: string
  query: string
  maxRerank?: number
  returnMetadata?: boolean
}

export interface SearchRawResponse {
  data: SearchResponse[]
}

export interface SearchResponse {
  document: number
  score: number
}
