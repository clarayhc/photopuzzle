import { Hono } from 'hono'

import imgList from './imgList.ts'
import chatGpt from './chatGpt.ts'

const api = new Hono()
api.route('/imgList', imgList)
api.route('/chatGpt', chatGpt)

export default api
