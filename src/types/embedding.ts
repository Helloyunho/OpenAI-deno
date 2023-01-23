import { LimitedUsage, LimitedUsageRaw } from './etc.ts'

export interface CreateEmbeddingsRawRequest {
  model: string
  input: string | string[] | number[][]
  user?: string
}

export interface CreateEmbeddingsParams {
  user?: string
}

export interface CreateEmbeddingsRawResponse {
  object: string
  model: string
  data: {
    index: number
    object: string
    embedding: number[]
  }[]
  usage: LimitedUsageRaw
}

export interface CreateEmbeddingsResponse {
  object: string
  model: string
  data: {
    index: number
    object: string
    embedding: number[]
  }[]
  usage: LimitedUsage
}
