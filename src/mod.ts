import {
  AnswerArgs,
  AnswerRawRequest,
  AnswerRawResponse,
  AnswerResponse
} from './types/answer.ts'
import {
  CreateSpeechParams,
  CreateSpeechRawRequest,
  CreateTranscriptionParams,
  CreateTranscriptionRawResponse,
  CreateTranslationParams,
  CreateTranslationRawResponse,
  CreateTranslationResponse
} from './types/audio.ts'
import {
  ChatFormat,
  ChatFormatRaw,
  CreateChatParams,
  CreateChatRawRequest,
  CreateChatRawResponse,
  CreateChatResponse
} from './types/chat.ts'
import {
  ClassificationArgs,
  ClassificationRawRequest,
  ClassificationRawResponse,
  ClassificationResponse
} from './types/classification.ts'
import {
  CreateCompletionParams,
  CompletionRawRequest,
  CompletionRawResponse,
  CreateCompletionResponse
} from './types/completion.ts'
import {
  CreateEditParams,
  CreateEditRawRequest,
  CreateEditRawResponse,
  CreateEditResponse
} from './types/edit.ts'
import {
  CreateEmbeddingsRawRequest,
  CreateEmbeddingsRawResponse,
  CreateEmbeddingsResponse
} from './types/embedding.ts'
import { EngineResponse, EnginesResponse } from './types/engine.ts'
import { ErrorResponse, OpenAIError } from './types/error.ts'
import {
  LimitedUsageRaw,
  LimitedUsage,
  LogProbsRaw,
  LogProbs,
  DeleteResponse
} from './types/etc.ts'
import { File as OpenAIFile, FileRaw, FilesRawResponse } from './types/file.ts'
import {
  CreateFineTuneParams,
  CreateFineTuneRawRequest,
  FineTune,
  FineTuneEvent,
  FineTuneEventRaw,
  FineTuneRaw
} from './types/fineTune.ts'
import {
  CreateImageEditParams,
  CreateImageParams,
  CreateImageRawRequest,
  CreateImageRawResponse,
  CreateImageResponse
} from './types/image.ts'
import { Model, ModelListRawResponse, ModelRaw } from './types/models.ts'
import { CreateModerationRawResponse, Moderation } from './types/moderation.ts'
import {
  SearchArgs,
  SearchRawRequest,
  SearchRawResponse,
  SearchResponse
} from './types/search.ts'
import { MAIN_URL } from './types/url.ts'
import { basename } from './deps.ts'
import { CreateTranscriptionResponse } from '../mod.ts'
import {
  CreateFineTuningJobParams,
  CreateFineTuningJobRawRequest,
  FineTuningEvent,
  FineTuningEventRaw,
  FineTuningJob,
  FineTuningJobRaw
} from './types/fineTuning.ts'
import {
  Assistant,
  AssistantFile,
  AssistantFileRaw,
  AssistantRaw,
  CreateAssistantParams,
  CreateAssistantRawRequest,
  ListAssistantFileQuery,
  ListAssistantQuery
} from './types/assistants.ts'
import {
  CreateThreadParams,
  CreateThreadRawRequest,
  Thread,
  ThreadRaw
} from './types/threads.ts'
import { HasMetadata } from './types/metadata.ts'
import {
  CreateMessageParams,
  CreateMessageRawRequest,
  ListMessageFileQuery,
  ListMessageQuery,
  Message,
  MessageFile,
  MessageFileRaw,
  MessageRaw
} from './types/messages.ts'
import {
  CreateRunParams,
  CreateRunRawRequest,
  ListRunQuery,
  ListRunStepsQuery,
  Run,
  RunRaw,
  RunStep,
  RunStepRaw,
  SubmitToolOutputsToRunRawRequest,
  ToolCall
} from './types/runs.ts'

export class OpenAI {
  _token?: string
  _organizationToken?: string

  constructor(token?: string, organizationToken?: string) {
    this._token = token
    this._organizationToken = organizationToken
  }

  get token(): string | undefined {
    if (this._token !== undefined) {
      return this._token
    } else {
      return Deno.env.get('OPENAI_API_KEY')
    }
  }

  get organizationToken(): string | undefined {
    if (this._organizationToken !== undefined) {
      return this._organizationToken
    } else {
      return Deno.env.get('OPENAI_API_ORGANIZATION_ID')
    }
  }

  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body,
    raw = false,
    query = {}
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: { [name: string]: string }
    body?: Record<string, unknown> | FormData | string
    raw?: false
    query?: Record<string, string | undefined>
  }): Promise<R>
  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body,
    raw,
    query = {}
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: { [name: string]: string }
    body?: Record<string, unknown> | FormData | string
    raw?: true
    query?: Record<string, string | undefined>
  }): Promise<Blob>
  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body,
    raw = false,
    query = {}
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: { [name: string]: string }
    body?: Record<string, unknown> | FormData | string
    raw?: boolean
    query?: Record<string, string | undefined>
  }): Promise<Blob | R> {
    if (this.token === undefined) {
      throw new Error('No token was provided.')
    }
    if (headers.Authorization === undefined) {
      headers.Authorization = `Bearer ${this.token}`
    }
    if (
      headers['OpenAI-Organization'] === undefined &&
      this.organizationToken !== undefined
    ) {
      headers['OpenAI-Organization'] = this.organizationToken
    }
    if (typeof body === 'object' && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }

    const urlParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v != undefined)
      ) as Record<string, string>
    )
    url = `${url}?${urlParams.toString()}`

    const resp = await fetch(`${MAIN_URL}${url}`, {
      headers,
      method,
      body
    })

    if (!resp.ok) {
      const errorContent: ErrorResponse = await resp.json()
      throw new OpenAIError(errorContent.error)
    }

    if (raw) {
      return await resp.blob()
    }

    const json = await resp.json()

    return json
  }

  /** @deprecated Use models instead. */
  async getEngines(): Promise<EngineResponse[]> {
    const resp = await this.request<EnginesResponse>({
      url: `/engines`
    })

    return resp.data
  }

  /** @deprecated Use models instead. */
  async getEngine(engineID: string): Promise<EngineResponse> {
    const resp = await this.request<EngineResponse>({
      url: `/engines/${engineID}`
    })

    return resp
  }

  private convertUsage(usage: LimitedUsageRaw): LimitedUsage {
    return {
      promptTokens: usage.prompt_tokens,
      totalTokens: usage.total_tokens,
      completionTokens: usage.completion_tokens
    }
  }

  private convertLogProbs(logProbs?: LogProbsRaw | null): LogProbs | undefined {
    if (logProbs) {
      return {
        tokens: logProbs.tokens,
        tokenLogprobs: logProbs.token_logprobs,
        textOffset: logProbs.text_offset,
        topLogprobs: logProbs.top_logprobs
      }
    } else {
      return undefined
    }
  }

  private convertFile(file: FileRaw): OpenAIFile {
    return {
      id: file.id,
      object: file.object,
      bytes: file.bytes,
      filename: file.filename,
      createdAt: file.created_at,
      purpose: file.purpose,
      status: file.status,
      statusDetails: file.status_details
    }
  }

  /**
   * Lists the currently available models, and provides basic information about each one such as the owner and availability.
   * @returns A list of models.
   */
  async listModels(): Promise<Model[]> {
    const resp = await this.request<ModelListRawResponse>({
      url: `/models`
    })

    return resp.data.map((model) => ({
      id: model.id,
      ownedBy: model.owned_by,
      created: model.created,
      object: model.object
    }))
  }

  /**
   * Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
   * @param modelID The ID of the model to use for this request
   * @returns A model.
   */
  async retrieveModel(modelID: string): Promise<Model> {
    const resp = await this.request<ModelRaw>({
      url: `/models/${modelID}`
    })

    return {
      id: resp.id,
      ownedBy: resp.owned_by,
      created: resp.created,
      object: resp.object
    }
  }

  /**
   * Delete a fine-tuned model. You must have the Owner role in your organization.
   * @param modelID The model to delete
   */
  async deleteModel(modelID: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      method: 'DELETE',
      url: `/models/${modelID}`
    })
  }

  /**
   * Creates a completion for the provided prompt and parameters
   * @param model ID of the model to use. You can use the {@link OpenAI#listModels} to see all of your available models, or see OpenAI's [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.
   * @param params Optional parameters for the API.
   * @returns Completion results.
   */
  async createCompletion(
    model: string,
    params?: CreateCompletionParams
  ): Promise<CreateCompletionResponse> {
    if (
      params?.presencePenalty !== undefined &&
      (params.presencePenalty > 2 || params.presencePenalty < -2)
    ) {
      throw new Error('Presence penalty should be in a range between 2 and -2.')
    }
    if (
      params?.frequencyPenalty !== undefined &&
      (params.frequencyPenalty > 2 || params.frequencyPenalty < -2)
    ) {
      throw new Error(
        'Frequency penalty should be in a range between 2 and -2.'
      )
    }

    const rawRequest: CompletionRawRequest = {
      model,
      prompt: params?.prompt,
      suffix: params?.suffix,
      max_tokens: params?.maxTokens,
      temperature: params?.temperature,
      top_p: params?.topP,
      n: params?.count,
      logprobs: params?.logprobs,
      echo: params?.echo,
      stop: params?.stop,
      presence_penalty: params?.presencePenalty,
      frequency_penalty: params?.frequencyPenalty,
      best_of: params?.bestOf,
      logit_bias: params?.logitBias,
      user: params?.user
    }

    const resp = await this.request<CompletionRawResponse>({
      url: `/completions`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      created: resp.created,
      model: resp.model,
      choices: resp.choices.map((choice) => ({
        text: choice.text,
        index: choice.index,
        logprobs: this.convertLogProbs(choice.logprobs),
        finishReason: choice.finish_reason
      })),
      usage: this.convertUsage(resp.usage)
    }
  }

  /** @deprecated This is deprecated without any replacement. */
  async createSearch(
    engineID: string,
    args: SearchArgs
  ): Promise<SearchResponse[]> {
    if (args.documents === undefined && args.file === undefined) {
      throw new Error('Either documents or file need to be specified.')
    } else if (args.documents !== undefined && args.file !== undefined) {
      throw new Error('Specifying both documents and file is not allowed.')
    }

    const rawRequest: SearchRawRequest = {
      documents: args.documents,
      file: args.file,
      query: args.query,
      max_rerank: args.maxRerank,
      return_metadata: args.returnMetadata
    }

    const resp = await this.request<SearchRawResponse>({
      url: `/engines/${engineID}/search`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return resp.data
  }

  /** @deprecated This is deprecated without any replacement. */
  async createClassification(
    engineID: string,
    args: ClassificationArgs
  ): Promise<ClassificationResponse> {
    if (args.examples === undefined && args.file === undefined) {
      throw new Error('Either examples or file need to be specified.')
    } else if (args.examples !== undefined && args.file !== undefined) {
      throw new Error('Specifying both examples and file is not allowed.')
    }

    const rawRequest: ClassificationRawRequest = {
      model: engineID,
      query: args.query,
      examples: args.examples,
      file: args.file,
      labels: args.labels,
      search_model: args.searchModel,
      temperature: args.temperature,
      logprobs: args.logprobs,
      max_examples: args.maxExamples,
      logit_bias: args.logitBias,
      return_prompt: args.returnPrompt,
      return_metadata: args.returnMetadata,
      expend: args.expend
    }

    const resp = await this.request<ClassificationRawResponse>({
      url: `/classifications`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      completion: resp.completion,
      label: resp.label,
      model: resp.model,
      searchModel: resp.search_model,
      selectedExamples: resp.selected_examples
    }
  }

  /** @deprecated This is deprecated without any replacement. */
  async createAnswer(
    engineID: string,
    args: AnswerArgs
  ): Promise<AnswerResponse> {
    if (args.documents === undefined && args.file === undefined) {
      throw new Error('Either documents or file need to be specified.')
    } else if (args.documents !== undefined && args.file !== undefined) {
      throw new Error('Specifying both documents and file is not allowed.')
    }

    const rawRequest: AnswerRawRequest = {
      model: engineID,
      question: args.question,
      examples: args.examples,
      examples_context: args.examplesContext,
      file: args.file,
      documents: args.documents,
      search_model: args.searchModel,
      max_rerank: args.maxRerank,
      temperature: args.temperature,
      logprobs: args.logprobs,
      max_tokens: args.maxTokens,
      stop: args.stop,
      n: args.count,
      logit_bias: args.logitBias,
      return_prompt: args.returnPrompt,
      return_metadata: args.returnMetadata,
      expend: args.expend
    }

    const resp = await this.request<AnswerRawResponse>({
      url: `/answers`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      answers: resp.answers,
      completion: resp.completion,
      model: resp.model,
      searchModel: resp.search_model,
      selectedDocuments: resp.selected_documents
    }
  }

  /**
   * Creates a completion for the chat message
   * @param model ID of the model to use. See the [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.
   * @param messages A list of messages comprising the conversation so far. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb).
   * @param params Optional parameters for the API.
   * @returns The chat completion response.
   */
  async createChat(
    model: string,
    messages: ChatFormat[],
    params?: CreateChatParams
  ): Promise<CreateChatResponse> {
    const rawRequest: CreateChatRawRequest = {
      model,
      messages: messages.map((msg) => {
        let fn_call: ChatFormatRaw['function_call'] | undefined = undefined
        if (msg.functionCall !== undefined) {
          fn_call = {
            name: msg.functionCall.name,
            arguments: JSON.stringify(msg.functionCall.arguments)
          }
        }

        return {
          role: msg.role,
          content: msg.content,
          name: msg.name,
          function_call: fn_call
        }
      }),
      functions: params?.functions,
      function_call:
        typeof params?.functionCall === 'object'
          ? {
              name: params.functionCall.name,
              arguments: JSON.stringify(params.functionCall.arguments)
            }
          : params?.functionCall,
      temperature: params?.temperature,
      top_p: params?.topP,
      n: params?.count,
      stop: params?.stop,
      max_tokens: params?.maxTokens,
      presence_penalty: params?.presencePenalty,
      frequency_penalty: params?.frequencyPenalty,
      logit_bias: params?.logitBias,
      user: params?.user
    }

    const resp = await this.request<CreateChatRawResponse>({
      url: `/chat/completions`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      created: resp.created,
      choices: resp.choices.map((choice) => {
        let fn_call: ChatFormat['functionCall'] | undefined = undefined
        if (choice.message.function_call !== undefined) {
          fn_call = {
            name: choice.message.function_call.name,
            arguments: JSON.parse(choice.message.function_call.arguments)
          }
        }
        return {
          message: {
            role: choice.message.role,
            content: choice.message.content,
            name: choice.message.name,
            functionCall: fn_call
          },
          index: choice.index,
          logprobs: this.convertLogProbs(choice.logprobs),
          finishReason: choice.finish_reason
        }
      }),
      usage: {
        promptTokens: resp.usage.prompt_tokens,
        completionTokens: resp.usage.completion_tokens,
        totalTokens: resp.usage.total_tokens
      }
    }
  }

  /**
   * Creates a new edit for the provided input, instruction, and parameters
   * @param model ID of the model to use.  You can use the `text-davinci-edit-001` or `code-davinci-edit-001` model with this endpoint.
   * @param instruction The instruction that tells the model how to edit the prompt.
   * @param params Optional parameters for the API.
   * @returns Edited texts.
   */
  async createEdit(
    model: string,
    instruction: string,
    params?: CreateEditParams
  ): Promise<CreateEditResponse> {
    const rawRequest: CreateEditRawRequest = {
      model,
      instruction,
      input: params?.input,
      n: params?.count,
      temperature: params?.temperature,
      top_p: params?.topP
    }

    const resp = await this.request<CreateEditRawResponse>({
      url: `/edits`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      object: resp.object,
      created: resp.created,
      choices: resp.choices.map((choice) => ({
        text: choice.text,
        index: choice.index,
        logprobs: this.convertLogProbs(choice.logprobs),
        finishReason: choice.finish_reason
      })),
      usage: {
        promptTokens: resp.usage.prompt_tokens,
        completionTokens: resp.usage.completion_tokens,
        totalTokens: resp.usage.total_tokens
      }
    }
  }

  /**
   * Creates an image given a prompt.
   * @param prompt A text description of the desired image(s). The maximum length is 1000 characters.
   * @param params Optional parameters for the API.
   * @returns URLs(or base64 encoded) of the generated images.
   */
  async createImage(
    prompt: string,
    params?: CreateImageParams
  ): Promise<CreateImageResponse> {
    const rawRequest: CreateImageRawRequest = {
      prompt,
      n: params?.count,
      quality: params?.quality,
      size: params?.size,
      response_format: params?.responseFormat,
      style: params?.style,
      user: params?.user
    }

    const resp = await this.request<CreateImageRawResponse>({
      url: `/images/generations`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      created: resp.created,
      data: resp.data.map((d) => d.url ?? d.b64_json ?? '')
    }
  }

  /**
   * Creates an edited or extended image given an original image and a prompt.
   * @param image The image(or image path) to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.
   * @param prompt A text description of the desired image(s). The maximum length is 1000 characters.
   * @param params Optional parameters for the API.
   * @returns URLs(or base64 encoded) of edited images.
   */
  async createImageEdit(
    image: string | BlobPart,
    prompt: string,
    params?: CreateImageEditParams,
    filename?: string
  ): Promise<CreateImageResponse> {
    const formData = new FormData()
    let fileBlob: File
    if (typeof image === 'string') {
      const fileArray = await Deno.readFile(image)
      const _filename = basename(image)
      fileBlob = new File([fileArray], filename ?? _filename)
    } else {
      if (filename === undefined) {
        throw new Error('No file name provided.')
      }
      fileBlob = new File([image], filename ?? 'unknown')
    }

    formData.append('image', fileBlob)
    formData.append('prompt', prompt)

    if (params?.mask !== undefined) {
      let fileBlob: File
      const mask = params.mask
      if (typeof mask.file === 'string') {
        const fileArray = await Deno.readFile(mask.file)
        const _filename = basename(mask.file)
        fileBlob = new File([fileArray], mask.name ?? _filename)
      } else {
        if (mask.name === undefined) {
          throw new Error('No file name provided.')
        }
        fileBlob = new File([mask.file], mask.name ?? 'unknown')
      }
      formData.append('mask', fileBlob)
    }
    if (params?.count !== undefined) {
      formData.append('n', params.count.toString())
    }
    if (params?.size !== undefined) {
      formData.append('size', params.size.toString())
    }
    if (params?.responseFormat !== undefined) {
      formData.append('response_format', params.responseFormat)
    }
    if (params?.user !== undefined) {
      formData.append('user', params.user)
    }

    const resp = await this.request<CreateImageRawResponse>({
      url: `/images/edits`,
      method: 'POST',
      body: formData
    })

    return {
      created: resp.created,
      data: resp.data.map((d) => d.url ?? d.b64_json ?? '')
    }
  }

  /**
   * Creates a variation of a given image.
   * @param image The image(or image path) to use as the basis for the variation(s). Must be a valid PNG file, less than 4MB, and square.
   * @param params Optional parameters for the API.
   * @returns URLs(or base64 encoded) of the generated images.
   */
  async createImageVariation(
    image: string | BlobPart,
    params?: CreateImageParams,
    filename?: string
  ): Promise<CreateImageResponse> {
    const formData = new FormData()
    let fileBlob: File
    if (typeof image === 'string') {
      const fileArray = await Deno.readFile(image)
      const _filename = basename(image)
      fileBlob = new File([fileArray], filename ?? _filename)
    } else {
      if (filename === undefined) {
        throw new Error('No file name provided.')
      }
      fileBlob = new File([image], filename ?? 'unknown')
    }

    formData.append('image', fileBlob)

    if (params?.count !== undefined) {
      formData.append('n', params.count.toString())
    }
    if (params?.size !== undefined) {
      formData.append('size', params.size.toString())
    }
    if (params?.responseFormat !== undefined) {
      formData.append('response_format', params.responseFormat)
    }
    if (params?.user !== undefined) {
      formData.append('user', params.user)
    }

    const resp = await this.request<CreateImageRawResponse>({
      url: `/images/variations`,
      method: 'POST',
      body: formData
    })

    return {
      created: resp.created,
      data: resp.data.map((d) => d.url ?? d.b64_json ?? '')
    }
  }

  /**
   * Creates an embedding vector representing the input text.
   * @param model ID of the model to use. You can use the {@link OpenAI#listModels} to see all of your available models, or see OpenAI's [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.
   * @param input Input text to embed, encoded as a string or array of tokens. To embed multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed the max input tokens for the model (8191 tokens for `text-embedding-ada-002`). [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.
   * @param user A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
   * @returns Embeddings for the input text.
   */
  async createEmbeddings(
    model: string,
    input: string | string[] | number[][],
    user?: string
  ): Promise<CreateEmbeddingsResponse> {
    const rawRequest: CreateEmbeddingsRawRequest = {
      model,
      input,
      user
    }

    const resp = await this.request<CreateEmbeddingsRawResponse>({
      url: `/embeddings`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      data: resp.data,
      model: resp.model,
      object: resp.object,
      usage: this.convertUsage(resp.usage)
    }
  }

  /**
   * Transcribes audio into the input language.
   * @param file The audio file to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
   * @param model ID of the model to use. Only `whisper-1` is currently available.
   * @param params Optional parameters for the API.
   * @returns The transcription of the audio.
   */
  async createTranscription(
    file: string | BlobPart,
    model: string,
    params?: CreateTranscriptionParams,
    filename?: string
  ): Promise<CreateTranscriptionResponse> {
    const formData = new FormData()
    let fileBlob: File
    if (typeof file === 'string') {
      const fileArray = await Deno.readFile(file)
      const _filename = basename(file)
      fileBlob = new File([fileArray], filename ?? _filename)
    } else {
      if (filename === undefined) {
        throw new Error('No file name provided.')
      }
      fileBlob = new File([file], filename ?? 'unknown')
    }

    formData.append('file', fileBlob)
    formData.append('model', model)
    formData.append('response_format', 'verbose_json')

    if (params?.prompt !== undefined) {
      formData.append('prompt', params.prompt)
    }
    if (params?.temperature !== undefined) {
      formData.append('temperature', params.temperature.toString())
    }
    if (params?.language !== undefined) {
      formData.append('language', params.language)
    }

    const resp = await this.request<CreateTranscriptionRawResponse>({
      url: `/audio/transcriptions`,
      method: 'POST',
      body: formData
    })

    return {
      task: resp.task,
      language: resp.language,
      duration: resp.duration,
      segments: resp.segments.map((s) => ({
        id: s.id,
        seek: s.seek,
        start: s.start,
        end: s.end,
        text: s.text,
        tokens: s.tokens,
        temperature: s.temperature,
        avgLogprob: s.avg_logprob,
        compressionRatio: s.compression_ratio,
        noSpeechProb: s.no_speech_prob,
        transient: s.transient
      })),
      text: resp.text
    }
  }

  /**
   * Translates audio into into English.
   * @param file The audio file to translate, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
   * @param model ID of the model to use. Only `whisper-1` is currently available.
   * @param params Optional parameters for the API.
   * @returns The translation of the audio.
   */
  async createTranslation(
    file: string | BlobPart,
    model: string,
    params?: CreateTranslationParams,
    filename?: string
  ): Promise<CreateTranslationResponse> {
    const formData = new FormData()
    let fileBlob: File
    if (typeof file === 'string') {
      const fileArray = await Deno.readFile(file)
      const _filename = basename(file)
      fileBlob = new File([fileArray], filename ?? _filename)
    } else {
      if (filename === undefined) {
        throw new Error('No file name provided.')
      }
      fileBlob = new File([file], filename ?? 'unknown')
    }

    formData.append('file', fileBlob)
    formData.append('model', model)
    formData.append('response_format', 'verbose_json')

    if (params?.prompt !== undefined) {
      formData.append('prompt', params.prompt)
    }
    if (params?.temperature !== undefined) {
      formData.append('temperature', params.temperature.toString())
    }

    const resp = await this.request<CreateTranslationRawResponse>({
      url: `/audio/translations`,
      method: 'POST',
      body: formData
    })

    return {
      task: resp.task,
      language: resp.language,
      duration: resp.duration,
      segments: resp.segments.map((s) => ({
        id: s.id,
        seek: s.seek,
        start: s.start,
        end: s.end,
        text: s.text,
        tokens: s.tokens,
        temperature: s.temperature,
        avgLogprob: s.avg_logprob,
        compressionRatio: s.compression_ratio,
        noSpeechProb: s.no_speech_prob,
        transient: s.transient
      })),
      text: resp.text
    }
  }

  /**
   * Alias for {@link OpenAI#this.listFiles}. This method is deprecated and will be removed in a future version.
   */
  async getFiles(): Promise<OpenAIFile[]> {
    return await this.listFiles()
  }

  /**
   * Returns a list of files that belong to the user's organization.
   * @returns List of files.
   */
  async listFiles(): Promise<OpenAIFile[]> {
    const resp = await this.request<FilesRawResponse>({
      url: `/files`,
      method: 'GET'
    })

    return resp.data.map((d) => ({
      id: d.id,
      object: d.object,
      bytes: d.bytes,
      createdAt: d.created_at,
      filename: d.filename,
      purpose: d.purpose,
      status: d.status,
      statusDetails: d.status_details
    }))
  }

  /**
   * Upload a file that contains document(s) to be used across various endpoints/features. Currently, the size of all the files uploaded by one organization can be up to 1 GB. Please contact OpenAI if you need to increase the storage limit.
   * @param file Name of the [JSON Lines](https://jsonlines.readthedocs.io/en/latest/) file to be uploaded.

   * If the `purpose` is set to "fine-tune", each line is a JSON record with "prompt" and "completion" fields representing your [training examples](https://platform.openai.com/docs/guides/fine-tuning/prepare-training-data).
   * @param purpose The intended purpose of the uploaded documents.

   * Use "fine-tune" for [Fine-tuning](https://platform.openai.com/docs/api-reference/fine-tunes). This allows OpenAI to validate the format of the uploaded file.
   * @returns The uploaded file.
   */
  async uploadFile(
    file: string | BlobPart,
    purpose: string,
    filename?: string
  ): Promise<OpenAIFile> {
    const formData = new FormData()
    let fileBlob: File
    if (typeof file === 'string') {
      const fileArray = await Deno.readFile(file)
      const _filename = basename(file)
      fileBlob = new File([fileArray], filename ?? _filename)
    } else {
      if (filename === undefined) {
        throw new Error('No file name provided.')
      }
      fileBlob = new File([file], filename ?? 'unknown')
    }

    formData.append('file', fileBlob)
    formData.append('purpose', purpose)

    const resp = await this.request<FileRaw>({
      url: `/files`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })

    return {
      id: resp.id,
      object: resp.object,
      bytes: resp.bytes,
      createdAt: resp.created_at,
      filename: resp.filename,
      purpose: resp.purpose,
      status: resp.status,
      statusDetails: resp.status_details
    }
  }

  /**
   * Delete a file.
   * @param fileID The ID of the file to use for this request
   */
  async deleteFile(fileID: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      url: `/files/${fileID}`,
      method: 'DELETE'
    })
  }

  /**
   * Alias for {@link OpenAI#retrieveFile}. This method is deprecated and will be removed in a future version.
   */
  async getFile(fileID: string): Promise<OpenAIFile> {
    return await this.retrieveFile(fileID)
  }

  /**
   * Returns information about a specific file.
   * @param fileID The ID of the file to use for this request
   * @returns The file.
   */
  async retrieveFile(fileID: string): Promise<OpenAIFile> {
    const resp = await this.request<FileRaw>({
      url: `/files/${fileID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      bytes: resp.bytes,
      createdAt: resp.created_at,
      filename: resp.filename,
      purpose: resp.purpose,
      status: resp.status,
      statusDetails: resp.status_details
    }
  }

  /**
   * Returns the contents of the specified file
   * @param fileID The ID of the file to use for this request
   * @returns The file contents in {@link Blob}.
   */
  async retrieveFileContent(fileID: string): Promise<Blob> {
    const resp = await this.request({
      url: `/files/${fileID}/content`,
      method: 'GET',
      raw: true
    })

    return resp
  }

  /**
   * Creates a job that fine-tunes a specified model from a given dataset.

   * Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)

   * @param trainingFile The ID of an uploaded file that contains training data.

   *                     See upload file for how to upload a file.

   *                     Your dataset must be formatted as a JSONL file. Additionally, you must upload your file with the purpose fine-tune.

   *                     See the fine-tuning guide for more details.
   * @param model The name of the model to fine-tune.
   *              You can select one of the [supported models](https://platform.openai.com/docs/guides/fine-tuning/what-models-can-be-fine-tuned).
   * @param params Optional parameters for the API.
   * @returns A fine-tuning.job object.
   */
  async createFineTuningJob(
    trainingFile: OpenAIFile | string,
    model: string,
    params?: CreateFineTuningJobParams
  ): Promise<FineTuningJob> {
    const rawRequest: CreateFineTuningJobRawRequest = {
      training_file:
        typeof trainingFile === 'string' ? trainingFile : trainingFile.id,
      validation_file:
        typeof params?.validationFile === 'string'
          ? params.validationFile
          : params?.validationFile?.id,
      model: model,
      hyperparameters: params?.hyperparameters
        ? {
            n_epochs: params.hyperparameters.nEpochs
          }
        : undefined,
      suffix: params?.suffix
    }

    const resp = await this.request<FineTuningJobRaw>({
      url: `/fine_tuning/jobs`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      updatedAt: resp.updated_at,
      model: resp.model,
      fineTunedModel: resp.fine_tuned_model,
      organizationID: resp.organization_id,
      hyperparameters: {
        nEpochs: resp.hyperparameters.n_epochs
      },
      trainingFile: resp.training_file,
      validationFile: resp.validation_file,
      resultFiles: resp.result_files,
      status: resp.status,
      trainedTokens: resp.trained_tokens
    }
  }

  /**
   * List your organization's fine-tuning jobs
   * @param after Identifier for the last job from the previous pagination request.
   * @param limit Number of fine-tuning jobs to retrieve.
   * @returns A list of paginated fine-tuning job objects.
   */
  async listFineTuningJobs(
    after?: string,
    limit?: number
  ): Promise<FineTuningJob[]> {
    const query: Record<string, string> = {}
    if (after !== undefined) {
      query.after = after
    }
    if (limit !== undefined) {
      query.limit = limit.toString()
    }
    const resp = await this.request<{
      data: FineTuningJobRaw[]
    }>({
      url: `/fine_tuning/jobs`,
      method: 'GET',
      query
    })

    return resp.data.map((d) => ({
      id: d.id,
      object: d.object,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      model: d.model,
      fineTunedModel: d.fine_tuned_model,
      organizationID: d.organization_id,
      hyperparameters: {
        nEpochs: d.hyperparameters.n_epochs
      },
      trainingFile: d.training_file,
      validationFile: d.validation_file,
      resultFiles: d.result_files,
      status: d.status,
      trainedTokens: d.trained_tokens
    }))
  }

  /**
   * Get info about a fine-tuning job.
   * @param jobID The ID of the fine-tuning job.
   * @returns The fine-tuning object with the given ID.
   */
  async retrieveFineTuningJob(jobID: string): Promise<FineTuningJob> {
    const resp = await this.request<FineTuningJobRaw>({
      url: `/fine_tuning/jobs/${jobID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      updatedAt: resp.updated_at,
      model: resp.model,
      fineTunedModel: resp.fine_tuned_model,
      organizationID: resp.organization_id,
      hyperparameters: {
        nEpochs: resp.hyperparameters.n_epochs
      },
      trainingFile: resp.training_file,
      validationFile: resp.validation_file,
      resultFiles: resp.result_files,
      status: resp.status,
      trainedTokens: resp.trained_tokens
    }
  }

  /**
   * Immediately cancel a fine-tune job.
   * @param jobID The ID of the fine-tuning job to cancel.
   * @returns The cancelled fine-tuning object.
   */
  async cancelFineTuningJob(jobID: string): Promise<FineTuningJob> {
    const resp = await this.request<FineTuningJobRaw>({
      url: `/fine_tuning/jobs/${jobID}/cancel`,
      method: 'POST'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      updatedAt: resp.updated_at,
      model: resp.model,
      fineTunedModel: resp.fine_tuned_model,
      organizationID: resp.organization_id,
      hyperparameters: {
        nEpochs: resp.hyperparameters.n_epochs
      },
      trainingFile: resp.training_file,
      validationFile: resp.validation_file,
      resultFiles: resp.result_files,
      status: resp.status,
      trainedTokens: resp.trained_tokens
    }
  }

  async listFineTuningEvents(
    jobID: string,
    after?: string,
    limit?: number
  ): Promise<FineTuningEvent[]> {
    const query: Record<string, string> = {}
    if (after !== undefined) {
      query.after = after
    }
    if (limit !== undefined) {
      query.limit = limit.toString()
    }
    const resp = await this.request<{
      data: FineTuningEventRaw[]
    }>({
      url: `/fine_tuning/jobs/${jobID}/events`,
      method: 'GET',
      query
    })

    return resp.data.map((d) => ({
      object: d.object,
      id: d.id,
      createdAt: d.created_at,
      level: d.level,
      message: d.message,
      data: d.data
        ? {
            step: d.data.step,
            trainLoss: d.data.train_loss,
            trainAccuracy: d.data.train_accuracy,
            validLoss: d.data.valid_loss,
            validMeanTokenAccuracy: d.data.valid_mean_token_accuracy
          }
        : null,
      type: d.type
    }))
  }

  /**
   * Creates a job that fine-tunes a specified model from a given dataset.

   * Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

   * [Learn more about Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   * @param trainingFile The ID of an uploaded file that contains training data.

   * See {@link OpenAI#uploadFile} for how to upload a file.

   * Your dataset must be formatted as a JSONL file, where each training example is a JSON object with the keys "prompt" and "completion". Additionally, you must upload your file with the purpose `fine-tune`.

   * See the [fine-tuning guide](https://platform.openai.com/docs/guides/fine-tuning/creating-training-data) for more details.
   * @param params Optional parameters for the API.
   * @returns The fine-tune job.
   */
  async createFineTune(
    trainingFile: OpenAIFile | string,
    params?: CreateFineTuneParams
  ): Promise<FineTune> {
    const rawRequest: CreateFineTuneRawRequest = {
      training_file:
        typeof trainingFile === 'string' ? trainingFile : trainingFile.id,
      validation_file:
        typeof params?.validationFile === 'string'
          ? params.validationFile
          : params?.validationFile?.id,
      model: params?.model,
      n_epochs: params?.epochs,
      batch_size: params?.batchSize,
      learning_rate_multiplier: params?.learningRate,
      prompt_loss_weight: params?.lossWeight,
      compute_classification_metrics: params?.computeClassificationMetrics,
      classification_n_classes: params?.classificationClasses,
      classification_positive_class: params?.classificationPositiveClass,
      classification_betas: params?.classificationBetas,
      suffix: params?.suffix
    }

    const resp = await this.request<FineTuneRaw>({
      url: `/fine-tunes`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      updatedAt: resp.updated_at,
      model: resp.model,
      fineTunedModel: resp.fine_tuned_model,
      organizationID: resp.organization_id,
      hyperparams: resp.hyperparams,
      trainingFiles: resp.training_files.map((f) => this.convertFile(f)),
      validationFiles: resp.validation_files.map((f) => this.convertFile(f)),
      resultFiles: resp.result_files.map((f) => this.convertFile(f)),
      events: resp.events.map((e) => ({
        object: e.object,
        createdAt: e.created_at,
        level: e.level,
        message: e.message
      }))
    }
  }

  /**
   * List your organization's fine-tuning jobs
   * @returns The fine-tune jobs.
   */
  async listFineTunes(): Promise<FineTune[]> {
    const resp = await this.request<{
      data: FineTuneRaw[]
    }>({
      url: `/fine-tunes`,
      method: 'GET'
    })

    return resp.data.map((d) => ({
      id: d.id,
      object: d.object,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      model: d.model,
      fineTunedModel: d.fine_tuned_model,
      organizationID: d.organization_id,
      hyperparams: d.hyperparams,
      trainingFiles: d.training_files.map((f) => this.convertFile(f)),
      validationFiles: d.validation_files.map((f) => this.convertFile(f)),
      resultFiles: d.result_files.map((f) => this.convertFile(f)),
      events: d.events.map((e) => ({
        object: e.object,
        createdAt: e.created_at,
        level: e.level,
        message: e.message
      }))
    }))
  }

  /**
   * Gets info about the fine-tune job.

   * [Learn more about Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   * @param fineTuneID The ID of the fine-tune job
   * @returns The fine-tune job.
   */
  async retrieveFineTune(fineTuneID: string): Promise<FineTune> {
    const resp = await this.request<FineTuneRaw>({
      url: `/fine-tunes/${fineTuneID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      updatedAt: resp.updated_at,
      model: resp.model,
      fineTunedModel: resp.fine_tuned_model,
      organizationID: resp.organization_id,
      hyperparams: resp.hyperparams,
      trainingFiles: resp.training_files.map((f) => this.convertFile(f)),
      validationFiles: resp.validation_files.map((f) => this.convertFile(f)),
      resultFiles: resp.result_files.map((f) => this.convertFile(f)),
      events: resp.events.map((e) => ({
        object: e.object,
        createdAt: e.created_at,
        level: e.level,
        message: e.message
      }))
    }
  }

  /**
   * Immediately cancel a fine-tune job.
   * @param fineTuneID The ID of the fine-tune job to cancel
   * @returns The canceled fine-tune job.
   */
  async cancelFineTune(fineTuneID: string): Promise<FineTune> {
    const resp = await this.request<FineTuneRaw>({
      url: `/fine-tunes/${fineTuneID}/cancel`,
      method: 'POST'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      updatedAt: resp.updated_at,
      model: resp.model,
      fineTunedModel: resp.fine_tuned_model,
      organizationID: resp.organization_id,
      hyperparams: resp.hyperparams,
      trainingFiles: resp.training_files.map((f) => this.convertFile(f)),
      validationFiles: resp.validation_files.map((f) => this.convertFile(f)),
      resultFiles: resp.result_files.map((f) => this.convertFile(f)),
      events: resp.events.map((e) => ({
        object: e.object,
        createdAt: e.created_at,
        level: e.level,
        message: e.message
      }))
    }
  }

  /**
   * Get fine-grained status updates for a fine-tune job.
   * @param fineTuneID The ID of the fine-tune job to get events for.
   * @returns The fine-tune job's events.
   */
  async listFineTuneEvents(fineTuneID: string): Promise<FineTuneEvent[]> {
    const resp = await this.request<{
      data: FineTuneEventRaw[]
    }>({
      url: `/fine-tunes/${fineTuneID}/events`,
      method: 'GET'
    })

    return resp.data.map((d) => ({
      object: d.object,
      createdAt: d.created_at,
      level: d.level,
      message: d.message
    }))
  }

  /**
   * Classifies if text violates OpenAI's Content Policy
   * @param input The input text to classify
   * @param model Two content moderations models are available: `text-moderation-stable` and `text-moderation-latest`.

   * The default is `text-moderation-latest` which will be automatically upgraded over time. This ensures you are always using OpenAI's most accurate model. If you use `text-moderation-stable`, OpenAI will provide advanced notice before updating the model. Accuracy of `text-moderation-stable` may be slightly lower than for `text-moderation-latest`.
   * @returns The moderation results.
   */
  async createModeration(
    input: string | string[],
    model?: 'text-moderation-latest' | 'text-moderation-stable'
  ): Promise<Moderation[]> {
    const resp = await this.request<CreateModerationRawResponse>({
      url: `/moderations`,
      method: 'POST',
      body: {
        input,
        model: model ?? 'text-moderation-latest'
      }
    })

    return resp.results.map((r) => ({
      flagged: r.flagged,
      categories: r.categories,
      categoryScores: r.category_scores
    }))
  }

  async createSpeech(
    model: 'tts-1' | 'tts-1-hd' | string,
    input: string,
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | string,
    params?: CreateSpeechParams
  ): Promise<Blob> {
    const rawRequest: CreateSpeechRawRequest = {
      model: model,
      input: input,
      voice: voice,
      response_format: params?.responseFormat,
      speed: params?.speed
    }

    const resp = await this.request({
      url: '/audio/speech',
      method: 'POST',
      body: {
        ...rawRequest
      },
      raw: true
    })

    return resp
  }

  async createAssistant(
    model: string,
    params?: CreateAssistantParams
  ): Promise<Assistant> {
    const rawRequest: CreateAssistantRawRequest = {
      model,
      name: params?.name,
      description: params?.description,
      instructions: params?.instructions,
      tools: params?.tools?.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'codeInterpreter' ? 'code_interpreter' : 'retrieval'
            }
      ),
      file_ids: params?.fileIDs,
      metadata: params?.metadata
    }

    const resp: AssistantRaw = await this.request({
      url: `/assistants`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      name: resp.name,
      description: resp.description,
      model: resp.model,
      instructions: resp.instructions,
      tools: resp.tools.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'code_interpreter' ? 'codeInterpreter' : 'retrieval'
            }
      ),
      fileIDs: resp.file_ids,
      metadata: resp.metadata
    }
  }

  async retrieveAssistant(assistantID: string): Promise<Assistant> {
    const resp: AssistantRaw = await this.request({
      url: `/assistants/${assistantID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      name: resp.name,
      description: resp.description,
      model: resp.model,
      instructions: resp.instructions,
      tools: resp.tools.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'code_interpreter' ? 'codeInterpreter' : 'retrieval'
            }
      ),
      fileIDs: resp.file_ids,
      metadata: resp.metadata
    }
  }

  async modifyAssistant(
    assistantID: string,
    params?: Partial<CreateAssistantParams> & {
      model?: string
    }
  ): Promise<Assistant> {
    const rawRequest: Partial<CreateAssistantRawRequest> = {
      model: params?.model,
      name: params?.name,
      description: params?.description,
      instructions: params?.instructions,
      tools: params?.tools?.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'codeInterpreter' ? 'code_interpreter' : 'retrieval'
            }
      ),
      file_ids: params?.fileIDs,
      metadata: params?.metadata
    }

    const resp: AssistantRaw = await this.request({
      url: `/assistants/${assistantID}`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      name: resp.name,
      description: resp.description,
      model: resp.model,
      instructions: resp.instructions,
      tools: resp.tools.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'code_interpreter' ? 'codeInterpreter' : 'retrieval'
            }
      ),
      fileIDs: resp.file_ids,
      metadata: resp.metadata
    }
  }

  async deleteAssistant(assistantID: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      url: `/assistants/${assistantID}`,
      method: 'DELETE'
    })
  }

  async listAssistants(query?: ListAssistantQuery): Promise<Assistant[]> {
    const resp = await this.request<{
      data: AssistantRaw[]
    }>({
      url: `/assistants`,
      method: 'GET',
      query: {
        limit: query?.limit?.toString(),
        after: query?.after,
        before: query?.before,
        order: query?.order
      }
    })

    return resp.data.map((d) => ({
      id: d.id,
      object: d.object,
      createdAt: d.created_at,
      name: d.name,
      description: d.description,
      model: d.model,
      instructions: d.instructions,
      tools: d.tools.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'code_interpreter' ? 'codeInterpreter' : 'retrieval'
            }
      ),
      fileIDs: d.file_ids,
      metadata: d.metadata
    }))
  }

  async createAssistantFile(
    assistantID: string,
    fileID: string
  ): Promise<AssistantFile> {
    const resp: AssistantFileRaw = await this.request({
      url: `/assistants/${assistantID}/files`,
      method: 'POST',
      body: {
        file_id: fileID
      }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      assistantID: resp.assistant_id
    }
  }

  async retrieveAssistantFile(
    assistantID: string,
    fileID: string
  ): Promise<AssistantFile> {
    const resp: AssistantFileRaw = await this.request({
      url: `/assistants/${assistantID}/files/${fileID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      assistantID: resp.assistant_id
    }
  }

  async deleteAssistantFile(
    assistantID: string,
    fileID: string
  ): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      url: `/assistants/${assistantID}/files/${fileID}`,
      method: 'DELETE'
    })
  }

  async listAssistantFiles(
    assistantID: string,
    query?: ListAssistantFileQuery
  ): Promise<AssistantFile[]> {
    const resp = await this.request<{
      data: AssistantFileRaw[]
    }>({
      url: `/assistants/${assistantID}/files`,
      method: 'GET',
      query: {
        limit: query?.limit?.toString(),
        after: query?.after,
        before: query?.before,
        order: query?.order
      }
    })

    return resp.data.map((d) => ({
      id: d.id,
      object: d.object,
      createdAt: d.created_at,
      assistantID: d.assistant_id
    }))
  }

  async createThread(params?: CreateThreadParams): Promise<Thread> {
    const rawRequest: CreateThreadRawRequest = {
      messages: params?.messages?.map((m) => ({
        role: m.role,
        content: m.content,
        file_ids: m.fileIDs,
        metadata: m.metadata
      })),
      metadata: params?.metadata
    }

    const resp: ThreadRaw = await this.request({
      url: `/threads`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      metadata: resp.metadata
    }
  }

  async retrieveThread(threadID: string): Promise<Thread> {
    const resp: ThreadRaw = await this.request({
      url: `/threads/${threadID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      metadata: resp.metadata
    }
  }

  async modifyThread(
    threadID: string,
    params?: Partial<HasMetadata>
  ): Promise<Thread> {
    const resp: ThreadRaw = await this.request({
      url: `/threads/${threadID}`,
      method: 'POST',
      body: { ...params }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      metadata: resp.metadata
    }
  }

  async deleteThread(threadID: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      url: `/threads/${threadID}`,
      method: 'DELETE'
    })
  }

  async createMessage(
    threadID: string,
    role: 'user' | string,
    content: string,
    params?: CreateMessageParams
  ): Promise<Message> {
    const rawRequest: CreateMessageRawRequest = {
      role: role,
      content: content,
      file_ids: params?.fileIDs,
      metadata: params?.metadata
    }

    const resp: MessageRaw = await this.request({
      url: `/threads/${threadID}/messages`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      threadID: resp.thread_id,
      role: resp.role,
      content: resp.content.map((c) => {
        if (c.type === 'image_file') {
          return {
            type: 'imageFile',
            fileID: c.image_file.file_id
          }
        } else if (c.type === 'text') {
          return {
            type: 'text',
            value: c.text.value,
            annotations: c.text.annotations.map((a) => {
              if (a.type === 'file_citation') {
                return {
                  type: 'fileCitation',
                  text: a.text,
                  fileID: a.file_citation.file_id,
                  quote: a.file_citation.quote,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else if (a.type === 'file_path') {
                return {
                  type: 'filePath',
                  text: a.text,
                  fileID: a.file_path.file_id,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else {
                throw new TypeError(`Unsupported(or unknown) annotation type`)
              }
            })
          }
        } else {
          throw new TypeError(`Unsupported(or unknown) content type`)
        }
      }),
      fileIDs: resp.file_ids,
      metadata: resp.metadata,
      runID: resp.run_id,
      assistantID: resp.assistant_id
    }
  }

  async retrieveMessage(threadID: string, messageID: string): Promise<Message> {
    const resp: MessageRaw = await this.request({
      url: `/threads/${threadID}/messages/${messageID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      threadID: resp.thread_id,
      role: resp.role,
      content: resp.content.map((c) => {
        if (c.type === 'image_file') {
          return {
            type: 'imageFile',
            fileID: c.image_file.file_id
          }
        } else if (c.type === 'text') {
          return {
            type: 'text',
            value: c.text.value,
            annotations: c.text.annotations.map((a) => {
              if (a.type === 'file_citation') {
                return {
                  type: 'fileCitation',
                  text: a.text,
                  fileID: a.file_citation.file_id,
                  quote: a.file_citation.quote,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else if (a.type === 'file_path') {
                return {
                  type: 'filePath',
                  text: a.text,
                  fileID: a.file_path.file_id,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else {
                throw new TypeError(`Unsupported(or unknown) annotation type`)
              }
            })
          }
        } else {
          throw new TypeError(`Unsupported(or unknown) content type`)
        }
      }),
      fileIDs: resp.file_ids,
      metadata: resp.metadata,
      runID: resp.run_id,
      assistantID: resp.assistant_id
    }
  }

  async modifyMessage(
    threadID: string,
    messageID: string,
    params?: HasMetadata
  ): Promise<Message> {
    const resp: MessageRaw = await this.request({
      url: `/threads/${threadID}/messages/${messageID}`,
      method: 'POST',
      body: { ...params }
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      threadID: resp.thread_id,
      role: resp.role,
      content: resp.content.map((c) => {
        if (c.type === 'image_file') {
          return {
            type: 'imageFile',
            fileID: c.image_file.file_id
          }
        } else if (c.type === 'text') {
          return {
            type: 'text',
            value: c.text.value,
            annotations: c.text.annotations.map((a) => {
              if (a.type === 'file_citation') {
                return {
                  type: 'fileCitation',
                  text: a.text,
                  fileID: a.file_citation.file_id,
                  quote: a.file_citation.quote,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else if (a.type === 'file_path') {
                return {
                  type: 'filePath',
                  text: a.text,
                  fileID: a.file_path.file_id,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else {
                throw new TypeError(`Unsupported(or unknown) annotation type`)
              }
            })
          }
        } else {
          throw new TypeError(`Unsupported(or unknown) content type`)
        }
      }),
      fileIDs: resp.file_ids,
      metadata: resp.metadata,
      runID: resp.run_id,
      assistantID: resp.assistant_id
    }
  }

  async listMessages(
    threadID: string,
    query?: ListMessageQuery
  ): Promise<Message[]> {
    const resp = await this.request<{
      data: MessageRaw[]
    }>({
      url: `/threads/${threadID}/messages`,
      method: 'GET',
      query: {
        limit: query?.limit?.toString(),
        after: query?.after,
        before: query?.before,
        order: query?.order
      }
    })

    return resp.data.map((d) => ({
      id: d.id,
      object: d.object,
      createdAt: d.created_at,
      threadID: d.thread_id,
      role: d.role,
      content: d.content.map((c) => {
        if (c.type === 'image_file') {
          return {
            type: 'imageFile',
            fileID: c.image_file.file_id
          }
        } else if (c.type === 'text') {
          return {
            type: 'text',
            value: c.text.value,
            annotations: c.text.annotations.map((a) => {
              if (a.type === 'file_citation') {
                return {
                  type: 'fileCitation',
                  text: a.text,
                  fileID: a.file_citation.file_id,
                  quote: a.file_citation.quote,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else if (a.type === 'file_path') {
                return {
                  type: 'filePath',
                  text: a.text,
                  fileID: a.file_path.file_id,
                  startIndex: a.start_index,
                  endIndex: a.end_index
                }
              } else {
                throw new TypeError(`Unsupported(or unknown) annotation type`)
              }
            })
          }
        } else {
          throw new TypeError(`Unsupported(or unknown) content type`)
        }
      }),
      fileIDs: d.file_ids,
      metadata: d.metadata,
      runID: d.run_id,
      assistantID: d.assistant_id
    }))
  }

  async retrieveMessageFile(
    threadID: string,
    messageID: string,
    fileID: string
  ): Promise<MessageFile> {
    const resp: MessageFileRaw = await this.request({
      url: `/threads/${threadID}/messages/${messageID}/files/${fileID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      object: resp.object,
      createdAt: resp.created_at,
      messageID: resp.message_id
    }
  }

  async listMessageFiles(
    threadID: string,
    messageID: string,
    query?: ListMessageFileQuery
  ): Promise<MessageFile[]> {
    const resp = await this.request<{
      data: MessageFileRaw[]
    }>({
      url: `/threads/${threadID}/messages/${messageID}/files`,
      method: 'GET',
      query: {
        limit: query?.limit?.toString(),
        after: query?.after,
        before: query?.before,
        order: query?.order
      }
    })

    return resp.data.map((d) => ({
      id: d.id,
      object: d.object,
      createdAt: d.created_at,
      messageID: d.message_id
    }))
  }

  convertRun(raw: RunRaw): Run {
    let status: Run['status']
    if (raw.status === 'in_progress') {
      status = 'inProgress'
    } else if (raw.status === 'requires_action') {
      status = 'requiresAction'
    } else {
      status = raw.status
    }

    return {
      id: raw.id,
      object: raw.object,
      createdAt: raw.created_at,
      threadID: raw.thread_id,
      assistantID: raw.assistant_id,
      status: status,
      requiredAction:
        raw.required_action !== null
          ? {
              type:
                raw.required_action.type === 'submit_tool_outputs'
                  ? 'submitToolOutputs'
                  : raw.required_action.type,
              submitToolOutputs: {
                toolCalls: raw.required_action.submit_tool_outputs.tool_calls
              }
            }
          : null,
      lastError:
        raw.last_error !== null
          ? {
              message: raw.last_error.message,
              code:
                raw.last_error.code === 'server_error'
                  ? 'serverError'
                  : raw.last_error.code === 'rate_limit_exceeded'
                  ? 'rateLimitExceeded'
                  : raw.last_error.code
            }
          : null,
      expiresAt: raw.expires_at,
      startedAt: raw.started_at,
      cancelledAt: raw.cancelled_at,
      failedAt: raw.failed_at,
      completedAt: raw.completed_at,
      model: raw.model,
      instructions: raw.instructions,
      tools: raw.tools.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'code_interpreter' ? 'codeInterpreter' : 'retrieval'
            }
      ),
      fileIDs: raw.file_ids,
      metadata: raw.metadata
    }
  }

  async createRun(
    threadID: string,
    assistantID: string,
    params?: CreateRunParams
  ): Promise<Run> {
    const rawRequest: CreateRunRawRequest = {
      assistant_id: assistantID,
      model: params?.model,
      instructions: params?.instructions,
      tools: params?.tools?.map((t) =>
        t.type === 'function'
          ? {
              type: t.type,
              function: t.function
            }
          : {
              type:
                t.type === 'codeInterpreter' ? 'code_interpreter' : 'retrieval'
            }
      ),
      metadata: params?.metadata
    }

    const resp: RunRaw = await this.request({
      url: `/threads/${threadID}/runs`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return this.convertRun(resp)
  }

  async retrieveRun(threadID: string, runID: string): Promise<Run> {
    const resp: RunRaw = await this.request({
      url: `/threads/${threadID}/runs/${runID}`,
      method: 'GET'
    })

    return this.convertRun(resp)
  }

  async modifyRun(
    threadID: string,
    runID: string,
    params?: HasMetadata
  ): Promise<Run> {
    const resp: RunRaw = await this.request({
      url: `/threads/${threadID}/runs/${runID}`,
      method: 'POST',
      body: { ...params }
    })

    return this.convertRun(resp)
  }

  async listRuns(threadID: string, query?: ListRunQuery): Promise<Run[]> {
    const resp = await this.request<{
      data: RunRaw[]
    }>({
      url: `/threads/${threadID}/runs`,
      method: 'GET',
      query: {
        limit: query?.limit?.toString(),
        after: query?.after,
        before: query?.before,
        order: query?.order
      }
    })

    return resp.data.map((d) => this.convertRun(d))
  }

  async submitToolOutputsToRun(
    threadID: string,
    runID: string,
    toolCalls: ToolCall[]
  ): Promise<Run> {
    const rawRequest: SubmitToolOutputsToRunRawRequest = {
      tool_outputs: toolCalls.map((t) => ({
        tool_call_id: t.id,
        output: t.output
      }))
    }

    const resp: RunRaw = await this.request({
      url: `/threads/${threadID}/runs/${runID}/submit_tool_outputs`,
      method: 'POST',
      body: { ...rawRequest }
    })

    return this.convertRun(resp)
  }

  async cancelRun(threadID: string, runID: string): Promise<Run> {
    const resp: RunRaw = await this.request({
      url: `/threads/${threadID}/runs/${runID}/cancel`,
      method: 'POST'
    })

    return this.convertRun(resp)
  }

  convertRunStep(raw: RunStepRaw): RunStep {
    let type: RunStep['type']
    if (raw.type === 'message_creation') {
      type = 'messageCreation'
    } else if (raw.type === 'tool_calls') {
      type = 'toolCalls'
    } else {
      type = raw.type
    }

    let status: RunStep['status']
    if (raw.status === 'in_progress') {
      status = 'inProgress'
    } else {
      status = raw.status
    }

    let stepDetails: RunStep['stepDetails']
    if (raw.step_details.type === 'message_creation') {
      stepDetails = {
        type: 'messageCreation',
        messageID: raw.step_details.message_creation.message_id
      }
    } else if (raw.step_details.type === 'tool_calls') {
      stepDetails = {
        type: 'toolCalls',
        // @ts-ignore bruh TS dumb
        toolCalls: raw.step_details.tool_calls.map((t) => {
          if (t.type === 'code_interpreter') {
            return {
              id: t.id,
              type: 'codeInterpreter',
              input: t.code_interpreter.input,
              outputs: t.code_interpreter.outputs
            }
          } else if (t.type === 'retrieval') {
            return {
              id: t.id,
              type: 'retrieval',
              retrieval: t.retrieval
            }
          } else if (t.type === 'function') {
            return {
              id: t.id,
              type: 'function',
              name: t.function.name,
              arguments: t.function.arguments,
              output: t.function.output
            }
          }
        })
      }
    }

    return {
      id: raw.id,
      object: raw.object,
      createdAt: raw.created_at,
      assistantID: raw.assistant_id,
      threadID: raw.thread_id,
      runID: raw.run_id,
      type,
      status,
      // @ts-ignore bruh TS dumb
      stepDetails,
      lastError:
        raw.last_error !== null
          ? {
              message: raw.last_error.message,
              code:
                raw.last_error.code === 'server_error'
                  ? 'serverError'
                  : raw.last_error.code === 'rate_limit_exceeded'
                  ? 'rateLimitExceeded'
                  : raw.last_error.code
            }
          : null,
      expiresAt: raw.expires_at,
      cancelledAt: raw.cancelled_at,
      failedAt: raw.failed_at,
      completedAt: raw.completed_at,
      metadata: raw.metadata
    }
  }

  async retrieveRunStep(
    threadID: string,
    runID: string,
    stepID: string
  ): Promise<RunStep> {
    const resp: RunStepRaw = await this.request({
      url: `/threads/${threadID}/runs/${runID}/steps/${stepID}`,
      method: 'GET'
    })

    return this.convertRunStep(resp)
  }

  async listRunSteps(
    threadID: string,
    runID: string,
    query?: ListRunStepsQuery
  ): Promise<RunStep[]> {
    const resp = await this.request<{
      data: RunStepRaw[]
    }>({
      url: `/threads/${threadID}/runs/${runID}/steps`,
      method: 'GET',
      query: {
        limit: query?.limit?.toString(),
        after: query?.after,
        before: query?.before,
        order: query?.order
      }
    })

    return resp.data.map((d) => this.convertRunStep(d))
  }
}
