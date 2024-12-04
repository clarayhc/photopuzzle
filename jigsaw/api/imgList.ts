import { Context, Hono } from 'hono'
import R from '../utils/R.ts'

const api = new Hono()

const imgList: Array<string> = []
for await (const entry of Deno.readDir('./static/images')) {
  imgList.push('images/' + entry.name)
}
imgList.splice(8)

api.get('/', (c: Context) => {
  return c.json(R.ok(imgList))
})

export default api
