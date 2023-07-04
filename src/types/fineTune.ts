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
  /**
   * The ID of an uploaded file that contains validation data.

   * If you provide this file, the data is used to generate validation metrics periodically during fine-tuning. These metrics can be viewed in the [fine-tuning results file](https://platform.openai.com/docs/guides/fine-tuning/analyzing-your-fine-tuned-model). Your train and validation data should be mutually exclusive.

   * Your dataset must be formatted as a JSONL file, where each validation example is a JSON object with the keys "prompt" and "completion". Additionally, you must upload your file with the purpose `fine-tune`.

   * See the [fine-tuning guide](https://platform.openai.com/docs/guides/fine-tuning/creating-training-data) for more details.
   */
  validationFile?: string | File
  /**
   * The name of the base model to fine-tune. You can select one of "ada", "babbage", "curie", "davinci", or a fine-tuned model created after 2022-04-21. To learn more about these models, see the [Models](https://platform.openai.com/docs/models) documentation.
   */
  model?: string
  /**
   * The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.
   */
  epochs?: number
  /**
   * The batch size to use for training. The batch size is the number of training examples used to train a single forward and backward pass.

   * By default, the batch size will be dynamically configured to be ~0.2% of the number of examples in the training set, capped at 256 - in general, OpenAI has found that larger batch sizes tend to work better for larger datasets.
   */
  batchSize?: number
  /**
   * The learning rate multiplier to use for training. The fine-tuning learning rate is the original learning rate used for pretraining multiplied by this value.

   * By default, the learning rate multiplier is the 0.05, 0.1, or 0.2 depending on final `batchSize` (larger learning rates tend to perform better with larger batch sizes). OpenAI recommends experimenting with values in the range 0.02 to 0.2 to see what produces the best results.
   */
  learningRate?: number
  /**
   * The weight to use for loss on the prompt tokens. This controls how much the model tries to learn to generate the prompt (as compared to the completion which always has a weight of 1.0), and can add a stabilizing effect to training when completions are short.

   * If prompts are extremely long (relative to completions), it may make sense to reduce this weight so as to avoid over-prioritizing learning the prompt.
   */
  lossWeight?: number
  /**
   * If set, OpenAI calculates classification-specific metrics such as accuracy and F-1 score using the validation set at the end of every epoch. These metrics can be viewed in the [results file](https://platform.openai.com/docs/guides/fine-tuning/analyzing-your-fine-tuned-model).

   * In order to compute classification metrics, you must provide a `validation_file`. Additionally, you must specify `classificationClasses` for multiclass classification or `classificationPositiveClass` for binary classification.
   */
  computeClassificationMetrics?: boolean
  /**
   * The number of classes in a classification task.

   * This parameter is required for multiclass classification.
   */
  classificationClasses?: number
  /**
   * The positive class in binary classification.

   * This parameter is needed to generate precision, recall, and F1 metrics when doing binary classification.
   */
  classificationPositiveClass?: string
  /**
   * If this is provided, OpenAI calculates F-beta scores at the specified beta values. The F-beta score is a generalization of F-1 score. This is only used for binary classification.

   * With a beta of 1 (i.e. the F-1 score), precision and recall are given the same weight. A larger beta score puts more weight on recall and less on precision. A smaller beta score puts more weight on precision and less on recall.
   */
  classificationBetas?: number[]
  /**
   * A string of up to 40 characters that will be added to your fine-tuned model name.

   * For example, a `suffix` of "custom-model-name" would produce a model name like `ada:ft-your-org:custom-model-name-2022-02-15-04-21-04`.
   */
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
