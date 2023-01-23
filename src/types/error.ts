export interface ErrorResponse {
  error: {
    code: number | null
    message: string
    param: string | null
    type: string
  }
}

export class OpenAIError extends Error {
  code: number | null
  message: string
  param: string | null
  type: string

  constructor(error: ErrorResponse['error']) {
    super(error.message)

    this.code = error.code
    this.message = error.message
    this.param = error.param
    this.type = error.type
  }
}
