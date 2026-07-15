import { CheckResult } from '../types/index.js'
import { v4 as uuidv4 } from 'uuid'

// In-memory storage (replace with database in production)
const checkResults: Map<string, CheckResult[]> = new Map()

export const CheckService = {
  // Create check result
  createResult: (result: Omit<CheckResult, 'id'>): CheckResult => {
    const id = uuidv4()
    const fullResult: CheckResult = { ...result, id }
    
    const manuscriptResults = checkResults.get(result.manuscriptId) || []
    manuscriptResults.push(fullResult)
    checkResults.set(result.manuscriptId, manuscriptResults)
    
    return fullResult
  },

  // Get results for manuscript
  getByManuscriptId: (manuscriptId: string): CheckResult[] => {
    return checkResults.get(manuscriptId) || []
  },

  // Update check result
  updateResult: (id: string, manuscriptId: string, updates: Partial<CheckResult>): CheckResult | undefined => {
    const results = checkResults.get(manuscriptId)
    if (!results) return undefined
    
    const index = results.findIndex(r => r.id === id)
    if (index === -1) return undefined
    
    results[index] = { ...results[index], ...updates }
    return results[index]
  },

  // Clear results for manuscript
  clearResults: (manuscriptId: string): boolean => {
    return checkResults.delete(manuscriptId)
  },
}
