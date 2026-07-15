import { Router, Request, Response } from 'express'
import { CheckService } from '../services/CheckService.js'
import { ManuscriptService } from '../services/ManuscriptService.js'
import { DictionaryService } from '../services/DictionaryService.js'
import { correctionEngine } from '../services/CorrectionEngine.js'

export const checkRoutes = Router()

// POST /api/check/manuscript - Run check on manuscript
checkRoutes.post('/manuscript', async (req: Request, res: Response) => {
  try {
    const { manuscriptId, text, dictionaryIds } = req.body
    
    if (!manuscriptId || !text) {
      res.status(400).json({
        success: false,
        error: 'manuscriptId and text are required',
      })
      return
    }

    const results: any[] = []

    // Rule-based typo detection
    const typos = correctionEngine.detectTypos(text)
    typos.forEach(typo => {
      typo.manuscriptId = manuscriptId
      results.push(CheckService.createResult(typo))
    })

    // Dictionary-based terminology check
    if (dictionaryIds && Array.isArray(dictionaryIds)) {
      dictionaryIds.forEach(dictId => {
        const dict = DictionaryService.getById(dictId)
        if (dict) {
          const terminologyResults = correctionEngine.checkTerminology(text, dict.entries)
          terminologyResults.forEach(result => {
            result.manuscriptId = manuscriptId
            result.dictionaryId = dictId
            results.push(CheckService.createResult(result))
          })
        }
      })
    }

    // Update manuscript status
    ManuscriptService.update(manuscriptId, {
      status: 'completed',
      content: text,
    })

    res.json({
      success: true,
      data: {
        manuscriptId,
        totalResults: results.length,
        results,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// GET /api/check/results/:manuscriptId - Get check results
checkRoutes.get('/results/:manuscriptId', (req: Request, res: Response) => {
  try {
    const results = CheckService.getByManuscriptId(req.params.manuscriptId)
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

// PUT /api/check/result/:resultId - Update check result decision
checkRoutes.put('/result/:resultId', (req: Request, res: Response) => {
  try {
    const { manuscriptId, editorDecision, editorComment } = req.body
    
    if (!manuscriptId || !editorDecision) {
      res.status(400).json({
        success: false,
        error: 'manuscriptId and editorDecision are required',
      })
      return
    }

    const result = CheckService.updateResult(req.params.resultId, manuscriptId, {
      reviewed: true,
      editorDecision,
      editorComment,
    })

    if (!result) {
      res.status(404).json({
        success: false,
        error: 'Check result not found',
      })
      return
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})
