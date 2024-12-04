import * as path from 'jsr:@std/path'
import { Buffer } from 'node:buffer'

const base64Map = new Map<string, string>()
const imageDir = './static/images'

for await (const dirEntry of Deno.readDir(imageDir)) {
  const imagePath = path.join(imageDir, dirEntry.name)
  const ext = path.extname(imagePath).slice(1)
  const data = await Deno.readFile(imagePath)
  const base64 = `data:image/${ext};base64,${Buffer.from(
    data
  ).toString('base64')}`
  const name = path.basename(imagePath)
  base64Map.set(name, base64)
}

export default base64Map
