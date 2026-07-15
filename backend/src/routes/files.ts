import { Router, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { ManuscriptService } from '../services/ManuscriptService.js'
import { CheckService } from '../services/CheckService.js'
import { ExportService } from '../services/ExportService.js'
import { correctionEngine } from '../services/CorrectionEngine.js'

export const fileRoutes = Router()

// POST /api/files/upload-manuscript
fileRoutes.post('/upload-manuscript', async (req: Request, res: Response) => {
  try {
    const { fileName, fileContent, metadata } = req.body
    
    if (!fileName || !fileContent) {
      res.status(400).json({
        success: false,
        error: 'fileName and fileContent are required',
      })
      return
    }

    // Extract text from base64 content
    let text = ''
    try {
      const buffer = Buffer.from(fileContent, 'base64')
      const extractedResult = await correctionEngine.extractTextFromDocx(buffer)
      text = extractedResult
    } catch (e) {
      // If extraction fails, treat as plain text
      text = Buffer.from(fileContent, 'base64').toString('utf-8')
    }

    const manuscript = ManuscriptService.create(fileName, fileName)
    ManuscriptService.update(manuscript.id, {
      content: text,
      metadata,
    })
    
    res.status(201).json({
      success: true,
      data: manuscript,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// POST /api/files/export
fileRoutes.post('/export', async (req: Request, res: Response) => {
  try {
    const { manuscriptId, format } = req.body // format: 'docx' | 'pdf' | 'markdown'
    
    if (!manuscriptId || !format) {
      res.status(400).json({
        success: false,
        error: 'manuscriptId and format are required',
      })
      return
    }

    const manuscript = ManuscriptService.getById(manuscriptId)
    if (!manuscript) {
      res.status(404).json({
        success: false,
        error: 'Manuscript not found',
      })
      return
    }

    const originalText = manuscript.content || ''
    const corrections = CheckService.getByManuscriptId(manuscriptId)

    let buffer: Buffer
    let contentType: string
    let filename: string

    switch (format) {
      case 'pdf':
        buffer = await ExportService.exportToPdf(manuscriptId, originalText, corrections)
        contentType = 'application/pdf'
        filename = `${manuscript.name.replace(/\.docx$/, '')}-corrected.pdf`
        break

      case 'markdown':
        buffer = ExportService.exportToMarkdown(manuscriptId, originalText, corrections)
        contentType = 'text/markdown'
        filename = `${manuscript.name.replace(/\.docx$/, '')}-corrected.md`
        break

      case 'docx':
      default:
        buffer = ExportService.exportToDocx(manuscriptId, originalText, corrections)
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        filename = `${manuscript.name.replace(/\.docx$/, '')}-corrected.docx`
        break
    }

    // Set response headers for file download
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', buffer.length)

    res.send(buffer)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// GET /api/files/download/:fileId
fileRoutes.get('/download/:fileId', (req: Request, res: Response) => {
  try {
    const { fileId } = req.params
    const uploadDir = path.join(process.cwd(), 'uploads')
    const filePath = path.join(uploadDir, fileId)

    // Security check: ensure file is in upload directory
    if (!filePath.startsWith(uploadDir)) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
      })
      return
    }

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: 'File not found',
      })
      return
    }

    res.download(filePath)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})
