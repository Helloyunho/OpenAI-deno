export interface ModelRaw {
  id: string
  object: string
  owned_by: string
  created: number
}

export interface Model {
  /** The unique identifier for the model. */
  id: string
  /** The user who owns the model. */
  ownedBy: string
  /** The date and time the model was created. */
  created: number
  object: string
}

export interface ModelListRawResponse {
  data: ModelRaw[]
  object: string
}
