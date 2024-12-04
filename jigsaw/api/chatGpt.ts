import { Context, Hono } from 'hono'
import { streamText } from 'hono/streaming'
import { chatWithImage } from '../utils/openai.ts'

const api = new Hono()

interface ReqBody {
  imageName: string
  message: string
}

api.post('/', async (c: Context) => {
  const { imageName, message }: ReqBody = await c.req.json()
  console.log({ message, imageName })
  const resultSteam = await chatWithImage(imageName, message)
  return streamText(c, async (stream) => {
    for await (const chunk of resultSteam) {
      await stream.write(chunk.choices[0]?.delta?.content || '')
    }
  })
})

export default api
