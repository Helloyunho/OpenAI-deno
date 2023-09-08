import { File } from './file.ts'

export interface FineTuningJobRaw {
  id: string
  object: 'fine_tuning.job'
  created_at: number
  updated_at: number
  model: string
  fine_tuned_model: string | null
  organization_id: string
  status:
    | 'created'
    | 'pending'
    | 'running'
    | 'succeeded'
    | 'failed'
    | 'cancelled'
  hyperparameters: {
    n_epochs: number | string
  }
  training_file: string
  validation_file: string | null
  result_files: string[]
  trained_tokens: number
}

export interface FineTuningJob {
  id: string
  object: 'fine_tuning.job'
  createdAt: number
  updatedAt: number
  model: string
  fineTunedModel: string | null
  organizationID: string
  status:
    | 'created'
    | 'pending'
    | 'running'
    | 'succeeded'
    | 'failed'
    | 'cancelled'
  hyperparameters: {
    nEpochs: number | string
  }
  trainingFile: string
  validationFile: string | null
  resultFiles: string[]
  trainedTokens: number
}

export interface CreateFineTuningJobRawRequest {
  training_file: string
  validation_file?: string | null
  model: string
  hyperparameters?: {
    n_epochs?: number
  }
  suffix?: string | null
}

export interface CreateFineTuningJobParams {
  /**
   * The ID of an uploaded file that contains validation data.

   * If you provide this file, the data is used to generate validation metrics periodically during fine-tuning.
   * These metrics can be viewed in the fine-tuning results file.
   * The same data should not be present in both train and validation files.

   * Your dataset must be formatted as a JSONL file. You must upload your file with the purpose `fine-tune`.

   * See the [fine-tuning guide](https://platform.openai.com/docs/guides/fine-tuning) for more details.
   */
  validationFile?: File | string | null
  /**
   * The hyperparameters used for the fine-tuning job.
   */
  hyperparameters?: {
    /**
     * The number of epochs to train the model for.
     * An epoch refers to one full cycle through the training dataset.
     */
    nEpochs?: number
  }
  /**
   * A string of up to 40 characters that will be added to your fine-tuned model name.

   * For example, a `suffix` of "custom-model-name" would produce a model name like `ft:gpt-3.5-turbo:openai:custom-model-name:7p4lURel`.
   */
  suffix?: string | null
}

export interface FineTuningEventRaw {
  object: 'fine_tuning.job.event'
  id: string
  created_at: number
  level: string
  message: string
  data: {
    step: number
    train_loss: number
    train_accuracy: number
    valid_loss: number
    valid_mean_token_accuracy: number
  } | null
  type: 'message' | 'metrics'
}

export interface FineTuningEvent {
  object: 'fine_tuning.job.event'
  id: string
  createdAt: number
  level: string
  message: string
  data: {
    step: number
    trainLoss: number
    trainAccuracy: number
    validLoss: number
    validMeanTokenAccuracy: number
  } | null
  type: 'message' | 'metrics'
}
