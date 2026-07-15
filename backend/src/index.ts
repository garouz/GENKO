import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { manuscriptRoutes } from './routes/manuscripts.js'
import { dictionaryRoutes } from './routes/dictionaries.js'
import { checkRoutes } from './routes/check.js'
import { fileRoutes } from './routes/files.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(requestLogger)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/manuscripts', manuscriptRoutes)
app.use('/api/dictionaries', dictionaryRoutes)
app.use('/api/check', checkRoutes)
app.use('/api/files', fileRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error handler (must be last)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 GENKO Backend Server`)
  console.log(`📍 Server running on http://localhost:${PORT}`)
  console.log(`🔗 API Base: http://localhost:${PORT}/api`)
  console.log(`❤️  Health check: http://localhost:${PORT}/health\n`)
})

export default app
