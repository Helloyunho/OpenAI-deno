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
  CompletionArgs,
  CompletionRawRequest,
  CompletionRawResponse,
  CompletionResponse
} from './types/completion.ts'
import { EngineResponse, EnginesResponse } from './types/engine.ts'
import { File, FileRaw, FilesRawResponse } from './types/file.ts'
import {
  SearchArgs,
  SearchRawRequest,
  SearchRawResponse,
  SearchResponse
} from './types/search.ts'
import { MAIN_URL } from './types/url.ts'

export class OpenAI {
  token: string
  organizationToken?: string

  constructor(token: string, organizationToken?: string) {
    this.token = token
    this.organizationToken = organizationToken
  }

  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: { [name: string]: string }
    body?: any
  }): Promise<R> {
    if (headers['Content-Type'] === undefined && body !== undefined) {
      headers['Content-Type'] = 'application/json'
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

    const resp = await fetch(`${MAIN_URL}${url}`, {
      headers,
      method,
      body
    })

    const json = await resp.json()

    return json
  }

  async getEngines(): Promise<EngineResponse[]> {
    const resp = await this.request<EnginesResponse>({
      url: `/engines`
    })

    return resp.data
  }

  async getEngine(engineID: string): Promise<EngineResponse> {
    const resp = await this.request<EngineResponse>({
      url: `/engines/${engineID}`
    })

    return resp
  }

  async createCompletion(
    engineID: string,
    args: CompletionArgs
  ): Promise<CompletionResponse> {
    if (
      args.presencePenalty !== undefined &&
      (args.presencePenalty > 1 || args.presencePenalty < 0)
    ) {
      throw new Error('Presence penalty cannot be more than 1 or less than 0.')
    }
    if (
      args.frequencyPenalty !== undefined &&
      (args.frequencyPenalty > 1 || args.frequencyPenalty < 0)
    ) {
      throw new Error('Frequency penalty cannot be more than 1 or less than 0.')
    }

    const rawRequest: CompletionRawRequest = {
      prompt: args.prompt,
      max_tokens: args.maxTokens,
      temperature: args.temperature,
      top_p: args.topP,
      n: args.count,
      logprobs: args.logprobs,
      echo: args.echo,
      stop: args.stop,
      presence_penalty: args.presencePenalty,
      frequency_penalty: args.frequencyPenalty,
      best_of: args.bestOf,
      logit_bias: args.logitBias
    }

    const resp = await this.request<CompletionRawResponse>({
      url: `/engines/${engineID}/completions`,
      method: 'POST',
      body: JSON.stringify(rawRequest)
    })

    return {
      id: resp.id,
      created: resp.created,
      model: resp.model,
      choices: resp.choices.map((choice) => ({
        text: choice.text,
        index: choice.index,
        logprobs: choice.logprobs,
        finishReason: choice.finish_reason
      }))
    }
  }

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
      body: JSON.stringify(rawRequest)
    })

    return resp.data
  }

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
      body: JSON.stringify(rawRequest)
    })

    return {
      completion: resp.completion,
      label: resp.label,
      model: resp.model,
      searchModel: resp.search_model,
      selectedExamples: resp.selected_examples
    }
  }

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
      body: JSON.stringify(rawRequest)
    })

    return {
      answers: resp.answers,
      completion: resp.completion,
      model: resp.model,
      searchModel: resp.search_model,
      selectedDocuments: resp.selected_documents
    }
  }

  async getFiles(): Promise<File[]> {
    const resp = await this.request<FilesRawResponse>({
      url: `/files`,
      method: 'GET'
    })

    return resp.data.map((d) => ({
      id: d.id,
      bytes: d.bytes,
      createdAt: d.created_at,
      filename: d.filename,
      format: d.format,
      purpose: d.purpose
    }))
  }

  async uploadFile(
    file:
      | {
          name: string
          content: Blob | Uint8Array
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
      fileBlob =
        file.content instanceof Uint8Array
          ? new Blob([file.content])
          : file.content
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
      bytes: resp.bytes,
      createdAt: resp.created_at,
      filename: resp.filename,
      format: resp.format,
      purpose: resp.purpose
    }
  }

  async getFile(fileID: string): Promise<File> {
    const resp = await this.request<FileRaw>({
      url: `/files/${fileID}`,
      method: 'GET'
    })

    return {
      id: resp.id,
      bytes: resp.bytes,
      createdAt: resp.created_at,
      filename: resp.filename,
      format: resp.format,
      purpose: resp.purpose
    }
  }

  async deleteFile(fileID: string): Promise<void> {
    await this.request<FileRaw>({
      url: `/files/${fileID}`,
      method: 'DELETE'
    })
  }
}
