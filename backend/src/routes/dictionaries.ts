import { Router, Request, Response } from 'express'
import { DictionaryService } from '../services/DictionaryService.js'

export const dictionaryRoutes = Router()

// GET /api/dictionaries - Get all dictionaries
dictionaryRoutes.get('/', (req: Request, res: Response) => {
  try {
    const dictionaries = DictionaryService.getAll()
    res.json({
      success: true,
      data: dictionaries,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// GET /api/dictionaries/:id - Get dictionary by ID
dictionaryRoutes.get('/:id', (req: Request, res: Response) => {
  try {
    const dictionary = DictionaryService.getById(req.params.id)
    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: 'Dictionary not found',
      })
      return
    }
    res.json({
      success: true,
      data: dictionary,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// POST /api/dictionaries - Create new dictionary
dictionaryRoutes.post('/', (req: Request, res: Response) => {
  try {
    const { name, entries } = req.body
    if (!name || !Array.isArray(entries)) {
      res.status(400).json({
        success: false,
        error: 'Name and entries array are required',
      })
      return
    }
    
    const dictionary = DictionaryService.create(name, name, entries)
    res.status(201).json({
      success: true,
      data: dictionary,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// GET /api/dictionaries/:id/search - Search dictionary
dictionaryRoutes.get('/:id/search', (req: Request, res: Response) => {
  try {
    const { term } = req.query
    if (!term || typeof term !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Term query parameter is required',
      })
      return
    }
    
    const results = DictionaryService.searchEntry(req.params.id, term)
    res.json({
      success: true,
      data: results,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// DELETE /api/dictionaries/:id - Delete dictionary
dictionaryRoutes.delete('/:id', (req: Request, res: Response) => {
  try {
    const success = DictionaryService.delete(req.params.id)
    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Dictionary not found',
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
