export interface CreateModerationRawResponse {
  id: string
  model: string
  results: ModerationRaw[]
}

export interface ModerationRaw {
  flagged: boolean
  categories: {
    hate: boolean
    'hate/threatening': boolean
    'self-harm': boolean
    sexual: boolean
    'sexual/minors': boolean
    violence: boolean
    'violence/graphic': boolean
  }
  category_scores: {
    hate: number
    'hate/threatening': number
    'self-harm': number
    sexual: number
    'sexual/minors': number
    violence: number
    'violence/graphic': number
  }
}

export interface Moderation {
  flagged: boolean
  categories: {
    hate: boolean
    'hate/threatening': boolean
    'self-harm': boolean
    sexual: boolean
    'sexual/minors': boolean
    violence: boolean
    'violence/graphic': boolean
  }
  categoryScores: {
    hate: number
    'hate/threatening': number
    'self-harm': number
    sexual: number
    'sexual/minors': number
    violence: number
    'violence/graphic': number
  }
}
