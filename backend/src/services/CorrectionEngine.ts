import * as mammoth from 'mammoth'
import Papa from 'papaparse'
import { CheckResult } from '../types/index.js'

export class CorectionEngine {
  // Rule-based typo detection (basic)
  detectTypos(text: string): CheckResult[] {
    const results: CheckResult[] = []
    
    // Example: Detect common Japanese typos (simplified)
    const typoPatterns = [
      { pattern: /。。/, suggestion: '。', message: '句点が重複しています' },
      { pattern: /、、/, suggestion: '、', message: '読点が重複しています' },
      { pattern: /\s{2,}/, suggestion: ' ', message: '複数の空白があります' },
    ]
    
    let match
    typoPatterns.forEach(({ pattern, suggestion, message }) => {
      const regex = new RegExp(pattern, 'g')
      while ((match = regex.exec(text)) !== null) {
        results.push({
          id: `typo-${Date.now()}-${Math.random()}`,
          manuscriptId: '',
          type: 'typo',
          position: {
            start: match.index,
            end: match.index + match[0].length,
          },
          originalText: match[0],
          suggestion,
          message,
          severity: 'warning',
          reviewed: false,
        })
      }
    })
    
    return results
  }

  // Dictionary-based terminology check
  checkTerminology(
    text: string,
    dictionaryEntries: Array<{ correctTerm: string; alternativeForms: string[] }>
  ): CheckResult[] {
    const results: CheckResult[] = []
    
    dictionaryEntries.forEach(entry => {
      entry.alternativeForms.forEach(altForm => {
        const regex = new RegExp(altForm, 'g')
        let match
        while ((match = regex.exec(text)) !== null) {
          results.push({
            id: `terminology-${Date.now()}-${Math.random()}`,
            manuscriptId: '',
            type: 'terminology',
            position: {
              start: match.index,
              end: match.index + match[0].length,
            },
            originalText: match[0],
            suggestion: entry.correctTerm,
            message: `推奨用語: "${entry.correctTerm}" を使用してください`,
            severity: 'info',
            reviewed: false,
          })
        }
      })
    })
    
    return results
  }

  // Extract text from Word document
  async extractTextFromDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: buffer })
      return result.value
    } catch (error) {
      throw new Error(`Failed to extract text from DOCX: ${error}`)
    }
  }

  // Parse CSV dictionary file
  parseCsvDictionary(csvContent: string): Array<{ correctTerm: string; alternativeForms: string[]; field?: string }> {
    try {
      const results: any[] = []
      const parsed = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      })
      
      parsed.data.forEach((row: any) => {
        if (row.correctTerm) {
          results.push({
            correctTerm: row.correctTerm,
            alternativeForms: row.alternativeForms
              ? row.alternativeForms.split('|').map((s: string) => s.trim())
              : [],
            field: row.field,
            description: row.description,
          })
        }
      })
      
      return results
    } catch (error) {
      throw new Error(`Failed to parse CSV dictionary: ${error}`)
    }
  }

  // Parse JSON dictionary file
  parseJsonDictionary(jsonContent: string): Array<{ correctTerm: string; alternativeForms: string[]; field?: string }> {
    try {
      const data = JSON.parse(jsonContent)
      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of entries')
      }
      return data
    } catch (error) {
      throw new Error(`Failed to parse JSON dictionary: ${error}`)
    }
  }
}

export const correctionEngine = new CorectionEngine()
