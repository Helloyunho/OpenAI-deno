export interface FileRaw {
  id: string
  object: string
  bytes: number
  created_at: number
  filename: string
  purpose: string
  status: string
  status_details: Record<string, unknown>
}

export interface File {
  id: string
  object: string
  bytes: number
  createdAt: number
  filename: string
  purpose: string
  status: string
  statusDetails: Record<string, unknown>
}

export interface FilesRawResponse {
  object: string
  data: FileRaw[]
}

export interface FilesResponse {
  object: string
  data: File[]
}
