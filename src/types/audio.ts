export interface CreateTranscriptionParams {
  /**
   * An optional text to guide the model's style or continue a previous audio segment.
   * The [prompt](https://platform.openai.com/docs/guides/speech-to-text/prompting) should match the audio language.
   */
  prompt?: string
  /**
   * The sampling temperature, between 0 and 1.
   * Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
   * If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
   */
  temperature?: number
  /**
   * The language of the input audio.
   * Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.
   */
  language?: string
}

export type CreateTranslationParams = Omit<
  CreateTranscriptionParams,
  'language'
>

export interface CreateTranscriptionRawResponse {
  task: string
  language: string
  duration: number
  segments: AudioSegmentRaw[]
  text: string
}

export interface AudioSegmentRaw {
  id: number
  seek: number
  start: number
  end: number
  text: string
  tokens: number[]
  temperature: number
  avg_logprob: number
  compression_ratio: number
  no_speech_prob: number
  transient: boolean
}

export interface AudioSegment {
  id: number
  seek: number
  start: number
  end: number
  text: string
  tokens: number[]
  temperature: number
  avgLogprob: number
  compressionRatio: number
  noSpeechProb: number
  transient: boolean
}

export interface CreateTranscriptionResponse {
  task: string
  language: string
  duration: number
  segments: AudioSegment[]
  text: string
}

export type CreateTranslationRawResponse = CreateTranscriptionRawResponse
export type CreateTranslationResponse = CreateTranscriptionResponse

export interface CreateSpeechRawRequest {
  model: 'tts-1' | 'tts-1-hd' | string
  input: string
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | string
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | string
  speed?: number
}

export interface CreateSpeechParams {
  responseFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | string
  speed?: number
}
