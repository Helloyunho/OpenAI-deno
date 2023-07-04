export interface CreateImageRawRequest {
  prompt: string
  n?: number
  size?: '256x256' | '512x512' | '1024x1024' | string
  response_format?: 'url' | 'b64_json' | string
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
  /**
   * The number of images to generate. Must be between 1 and 10.
   */
  count?: number
  /**
   * The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`.
   */
  size?: '256x256' | '512x512' | '1024x1024' | string
  /**
   * The format in which the generated images are returned. Must be one of `url` or `b64_json`.
   */
  responseFormat?: 'url' | 'b64_json' | string
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
   */
  user?: string
}

export interface CreateImageResponse {
  created: number
  data: string[]
}

export interface CreateImageEditParams {
  /**
   * An additional image(or image path) whose fully transparent areas (e.g. where alpha is zero) indicate where `image` should be edited. Must be a valid PNG file, less than 4MB, and have the same dimensions as `image`.
   */
  mask?: {
    file: string | BlobPart
    name?: string
  }
  /**
   * The number of images to generate. Must be between 1 and 10.
   */
  count?: number
  /**
   * The size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024`.
   */
  size?: '256x256' | '512x512' | '1024x1024' | string
  /**
   * The format in which the generated images are returned. Must be one of `url` or `b64_json`.
   */
  responseFormat?: 'url' | 'b64_json' | string
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
   */
  user?: string
}
