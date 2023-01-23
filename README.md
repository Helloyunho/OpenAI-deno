# OpenAI-deno

An unofficial OpenAI API wrapper for deno.

## Usage

See the Documentation [here](https://deno.land/x/openai_deno/mod.ts).

```ts
import { OpenAI } from 'https://deno.land/x/openai_deno/mod.ts'

const openai = new OpenAI() // It automatically finds token from OPENAI_API_TOKEN env variable.
// You can also paste it to constructor's parameter. (NOT RECOMMENDED)

const completion: CreateCompletionResponse = await openai.createCompletion(
  'code-davinci-002',
  {
    prompt: `Q: Write "Hello, World!"
A: console.log("Hello, World!")
Q: Ask user to drink
A: confirm("Do you want something to drink?")
Q: Write the result above
A:`,
    temperature: 0.5,
    frequencyPenalty: 0.2,
    presencePenalty: 0,
    stop: '\n',
    maxTokens: 100
  }
)

console.log(completion.choices[0].text) // console.log(confirm("Do you want something to drink?"))
```
