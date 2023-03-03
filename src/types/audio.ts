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
   * Supplying the input language in ISO-639-1 format will improve accuracy and latency.
   */
  language?: string
}

export type CreateTranslationParams = Omit<
  CreateTranscriptionParams,
  'language'
>

export interface CreateTranscriptionRawResponse {
  text: string
}

export type CreateTranslationRawResponse = CreateTranscriptionRawResponse
