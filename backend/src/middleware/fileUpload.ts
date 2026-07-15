import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '../../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow .docx for manuscripts
  if (req.path.includes('manuscripts') && file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true)
  }
  // Allow .csv and .json for dictionaries
  else if (req.path.includes('dictionaries')) {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
      cb(null, true)
    } else {
      cb(new Error('Only CSV and JSON files are allowed for dictionaries'))
    }
  } else {
    cb(new Error('Invalid file type'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 52428800, // 50MB
  },
})
