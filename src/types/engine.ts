export interface EnginesResponse {
  data: EngineResponse[]
}

export interface EngineResponse {
  id: string
  owner: string
  ready: boolean
}
