export type Metadata = Record<string, unknown> // at least for now

export interface HasMetadata {
  metadata?: Metadata
}
