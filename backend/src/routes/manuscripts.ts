import { Router, Request, Response } from 'express'
import { ManuscriptService } from '../services/ManuscriptService.js'

export const manuscriptRoutes = Router()

// GET /api/manuscripts - Get all manuscripts
manuscriptRoutes.get('/', (req: Request, res: Response) => {
  try {
    const manuscripts = ManuscriptService.getAll()
    res.json({
      success: true,
      data: manuscripts,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// GET /api/manuscripts/:id - Get manuscript by ID
manuscriptRoutes.get('/:id', (req: Request, res: Response) => {
  try {
    const manuscript = ManuscriptService.getById(req.params.id)
    if (!manuscript) {
      res.status(404).json({
        success: false,
        error: 'Manuscript not found',
      })
      return
    }
    res.json({
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

// POST /api/manuscripts - Create new manuscript
manuscriptRoutes.post('/', (req: Request, res: Response) => {
  try {
    const { name } = req.body
    if (!name) {
      res.status(400).json({
        success: false,
        error: 'Name is required',
      })
      return
    }
    
    const manuscript = ManuscriptService.create(name, name)
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

// PUT /api/manuscripts/:id - Update manuscript
manuscriptRoutes.put('/:id', (req: Request, res: Response) => {
  try {
    const manuscript = ManuscriptService.update(req.params.id, req.body)
    if (!manuscript) {
      res.status(404).json({
        success: false,
        error: 'Manuscript not found',
      })
      return
    }
    res.json({
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

// DELETE /api/manuscripts/:id - Delete manuscript
manuscriptRoutes.delete('/:id', (req: Request, res: Response) => {
  try {
    const success = ManuscriptService.delete(req.params.id)
    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Manuscript not found',
      })
      return
    }
    res.json({
      success: true,
      data: { id: req.params.id },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})
