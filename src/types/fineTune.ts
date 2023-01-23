import { File, FileRaw } from './file.ts'

export interface CreateFineTuneRawRequest {
  training_file: string
  validation_file?: string
  model?: string
  n_epochs?: number
  batch_size?: number
  learning_rate_multiplier?: number
  prompt_loss_weight?: number
  compute_classification_metrics?: boolean
  classification_n_classes?: number
  classification_positive_class?: string
  classification_betas?: number[]
  suffix?: string
}

export interface CreateFineTuneParams {
  validationFile?: string | File
  model?: string
  epochs?: number
  batchSize?: number
  learningRate?: number
  lossWeight?: number
  computeClassificationMetrics?: boolean
  classificationClasses?: number
  classificationPositiveClass?: string
  classificationBetas?: number[]
  suffix?: string
}

export interface FineTuneEventRaw {
  object: string
  created_at: number
  level: string
  message: string
}

export interface FineTuneEvent {
  object: string
  createdAt: number
  level: string
  message: string
}

export interface FineTuneRaw {
  id: string
  object: string
  created_at: number
  updated_at: number
  model: string
  fine_tuned_model: string
  organization_id: string
  hyperparams: Record<string, unknown>
  training_files: FileRaw[]
  validation_files: FileRaw[]
  result_files: FileRaw[]
  events: FineTuneEventRaw[]
}

export interface FineTune {
  id: string
  object: string
  createdAt: number
  updatedAt: number
  model: string
  fineTunedModel: string
  organizationID: string
  hyperparams: Record<string, unknown>
  trainingFiles: File[]
  validationFiles: File[]
  resultFiles: File[]
  events: FineTuneEvent[]
}
