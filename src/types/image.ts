export interface CreateImageRawRequest {
  prompt: string
  n?: number
  size?: '256x256' | '512x512' | '1024x1024'
  response_format?: 'url' | 'b64_json'
  user?: string
}

export interface CreateImageRawResponse {
  created: number
  data: {
    url?: string
    b64_json?: string
  }[]
}

export interface CreateImageParams {
  n?: number
  size?: '256x256' | '512x512' | '1024x1024'
  responseFormat?: 'url' | 'b64_json'
  user?: string
}

export interface CreateImageResponse {
  created: number
  data: string[]
}

export interface CreateImageEditParams {
  mask?: string | BlobPart
  n?: number
  size?: '256x256' | '512x512' | '1024x1024'
  responseFormat?: 'url' | 'b64_json'
  user?: string
}
