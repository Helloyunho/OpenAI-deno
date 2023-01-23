import {
  AnswerArgs,
  AnswerRawRequest,
  AnswerRawResponse,
  AnswerResponse
} from './types/answer.ts'
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
  CreateEmbeddingsParams,
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
import { File, FileRaw, FilesRawResponse } from './types/file.ts'
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
      return Deno.env.get('OPENAI_API_TOKEN')
    }
  }

  get organizationToken(): string | undefined {
    if (this._organizationToken !== undefined) {
      return this._organizationToken
    } else {
      return Deno.env.get('OPENAI_API_ORGANIZATION_TOKEN')
    }
  }

  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body,
    raw = false
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: { [name: string]: string }
    body?: Record<string, unknown> | FormData | string
    raw?: false
  }): Promise<R>
  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body,
    raw
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: { [name: string]: string }
    body?: Record<string, unknown> | FormData | string
    raw?: true
  }): Promise<Blob>
  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body,
    raw = false
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: { [name: string]: string }
    body?: Record<string, unknown> | FormData | string
    raw?: boolean
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

  private convertFile(file: FileRaw): File {
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

  async deleteModel(modelID: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      method: 'DELETE',
      url: `/models/${modelID}`
    })
  }

  async createCompletion(
    model: string,
    params: CreateCompletionParams
  ): Promise<CreateCompletionResponse> {
    if (
      params.presencePenalty !== undefined &&
      (params.presencePenalty > 2 || params.presencePenalty < -2)
    ) {
      throw new Error('Presence penalty should be in a range between 2 and -2.')
    }
    if (
      params.frequencyPenalty !== undefined &&
      (params.frequencyPenalty > 2 || params.frequencyPenalty < -2)
    ) {
      throw new Error(
        'Frequency penalty should be in a range between 2 and -2.'
      )
    }

    const rawRequest: CompletionRawRequest = {
      model,
      prompt: params.prompt,
      suffix: params.suffix,
      max_tokens: params.maxTokens,
      temperature: params.temperature,
      top_p: params.topP,
      n: params.count,
      logprobs: params.logprobs,
      echo: params.echo,
      stop: params.stop,
      presence_penalty: params.presencePenalty,
      frequency_penalty: params.frequencyPenalty,
      best_of: params.bestOf,
      logit_bias: params.logitBias,
      user: params.user
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

  async createEdit(
    model: string,
    instruction: string,
    params: CreateEditParams
  ): Promise<CreateEditResponse> {
    const rawRequest: CreateEditRawRequest = {
      model,
      instruction,
      input: params.input,
      n: params.n,
      temperature: params.temperature,
      top_p: params.topP
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

  async createImage(
    prompt: string,
    params: CreateImageParams
  ): Promise<CreateImageResponse> {
    const rawRequest: CreateImageRawRequest = {
      prompt,
      n: params.n,
      size: params.size,
      response_format: params.responseFormat,
      user: params.user
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

  async createImageEdit(
    image: string | BlobPart,
    prompt: string,
    params: CreateImageEditParams
  ): Promise<CreateImageResponse> {
    const formData = new FormData()
    let fileBlob: Blob
    if (typeof image === 'string') {
      const fileArray = await Deno.readFile(image)
      fileBlob = new Blob([fileArray])
    } else {
      fileBlob = new Blob([image])
    }

    formData.append('image', fileBlob)
    formData.append('prompt', prompt)

    if (params.mask !== undefined) {
      let fileBlob: Blob
      if (typeof image === 'string') {
        const fileArray = await Deno.readFile(image)
        fileBlob = new Blob([fileArray])
      } else {
        fileBlob = new Blob([image])
      }
      formData.append('mask', fileBlob)
    }
    if (params.n !== undefined) {
      formData.append('n', params.n.toString())
    }
    if (params.size !== undefined) {
      formData.append('size', params.size.toString())
    }
    if (params.responseFormat !== undefined) {
      formData.append('response_format', params.responseFormat)
    }
    if (params.user !== undefined) {
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

  async createImageVariation(
    image: string | BlobPart,
    params: CreateImageParams
  ): Promise<CreateImageResponse> {
    const formData = new FormData()
    let fileBlob: Blob
    if (typeof image === 'string') {
      const fileArray = await Deno.readFile(image)
      fileBlob = new Blob([fileArray])
    } else {
      fileBlob = new Blob([image])
    }

    formData.append('image', fileBlob)

    if (params.n !== undefined) {
      formData.append('n', params.n.toString())
    }
    if (params.size !== undefined) {
      formData.append('size', params.size.toString())
    }
    if (params.responseFormat !== undefined) {
      formData.append('response_format', params.responseFormat)
    }
    if (params.user !== undefined) {
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

  async createEmbeddings(
    model: string,
    input: string | string[] | number[][],
    params: CreateEmbeddingsParams
  ): Promise<CreateEmbeddingsResponse> {
    const rawRequest: CreateEmbeddingsRawRequest = {
      model,
      input,
      user: params.user
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

  async getFiles(): Promise<File[]> {
    return await this.listFiles()
  }

  async listFiles(): Promise<File[]> {
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

  async uploadFile(
    file:
      | {
          name: string
          content: BlobPart
        }
      | string,
    purpose: string
  ): Promise<File> {
    const formData = new FormData()
    let name: string
    let fileBlob: Blob
    if (typeof file === 'string') {
      name = file
      const fileArray = await Deno.readFile(file)
      fileBlob = new Blob([fileArray])
    } else {
      name = file.name
      fileBlob = new Blob([file.content])
    }

    formData.append('file', fileBlob, name)
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

  async deleteFile(fileID: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      url: `/files/${fileID}`,
      method: 'DELETE'
    })
  }

  async getFile(fileID: string): Promise<File> {
    return await this.retrieveFile(fileID)
  }

  async retrieveFile(fileID: string): Promise<File> {
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

  async retrieveFileContent(fileID: string): Promise<Blob> {
    const resp = await this.request({
      url: `/files/${fileID}/content`,
      method: 'GET',
      raw: true
    })

    return resp
  }

  async createFineTune(
    trainingFile: File | string,
    params: CreateFineTuneParams
  ): Promise<FineTune> {
    const rawRequest: CreateFineTuneRawRequest = {
      training_file:
        typeof trainingFile === 'string' ? trainingFile : trainingFile.id,
      validation_file:
        typeof params.validationFile === 'string'
          ? params.validationFile
          : params.validationFile?.id,
      model: params.model,
      n_epochs: params.epochs,
      batch_size: params.batchSize,
      learning_rate_multiplier: params.learningRate,
      prompt_loss_weight: params.lossWeight,
      compute_classification_metrics: params.computeClassificationMetrics,
      classification_n_classes: params.classificationClasses,
      classification_positive_class: params.classificationPositiveClass,
      classification_betas: params.classificationBetas,
      suffix: params.suffix
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

  async deleteFineTune(fineTuneID: string): Promise<DeleteResponse> {
    return await this.request<DeleteResponse>({
      url: `/fine-tunes/${fineTuneID}`,
      method: 'DELETE'
    })
  }

  async createModeration(
    input: string | string[],
    model?: 'text-moderation-latest' | 'text-moderation-stable'
  ): Promise<Moderation[]> {
    const resp = await this.request<CreateModerationRawResponse>({
      url: `/moderations`,
      method: 'POST',
      body: {
        input,
        model: model || 'text-moderation-latest'
      }
    })

    return resp.results.map((r) => ({
      flagged: r.flagged,
      categories: r.categories,
      categoryScores: r.category_scores
    }))
  }
}
