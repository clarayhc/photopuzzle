import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
import { logger } from 'hono/logger'
import api from './api/index.ts'

const app = new Hono()
app.use(logger())
app.route('/api', api)
app.get('/*', serveStatic({ root: './static' }))
app.get('/jigsaw/*', serveStatic({ path: './static/jigsaw.html' }))

Deno.serve(app.fetch)
