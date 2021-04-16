export interface FileRaw {
  id: string
  bytes: number
  created_at: number
  filename: string
  format: string
  purpose: string
}

export interface File {
  id: string
  bytes: number
  createdAt: number
  filename: string
  format: string
  purpose: string
}

export interface FilesRawResponse {
  data: FileRaw[]
}
