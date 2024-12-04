import 'jsr:@std/dotenv/load'
import OpenAI from 'jsr:@openai/openai'
import * as path from 'jsr:@std/path'

import base64Map from './base64Map.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  maxRetries: 5
})

export async function chatWithImage(
  imageName: string,
  message: string
) {
  const basename = path.basename(imageName)
  const base64 = base64Map.get(basename)!
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: message },
          {
            type: 'image_url',
            image_url: {
              url: base64
            }
          }
        ]
      }
    ]
  })
  return stream
}
