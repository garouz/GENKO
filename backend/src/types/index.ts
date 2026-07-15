export interface Manuscript {
  id: string
  name: string
  originalName: string
  uploadDate: Date
  status: 'processing' | 'completed' | 'error'
  content?: string
  metadata?: {
    title?: string
    author?: string
    createdDate?: Date
    modifiedDate?: Date
  }
  error?: string
}

export interface DictionaryEntry {
  id: string
  correctTerm: string
  alternativeForms: string[]
  field?: string
  description?: string
}

export interface Dictionary {
  id: string
  name: string
  originalName: string
  uploadDate: Date
  entries: DictionaryEntry[]
  itemCount: number
}

export interface CheckResult {
  id: string
  manuscriptId: string
  type: 'typo' | 'terminology' | 'medical' | 'other'
  position: {
    start: number
    end: number
    line?: number
  }
  originalText: string
  suggestion?: string
  message: string
  severity: 'error' | 'warning' | 'info'
  reviewed: boolean
  editorDecision?: 'apply' | 'ignore'
  editorComment?: string
  dictionaryId?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
