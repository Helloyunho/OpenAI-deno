export interface FunctionRaw {
  name: string
  description?: string
  parameters?: Record<string, unknown>
}

export interface Function {
  /** The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64. */
  name: string
  /** The description of what the function does. */
  description?: string
  /** The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/gpt/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. */
  parameters?: Record<string, unknown>
}
