// Manuscript types
export interface Manuscript {
  id: string
  name: string
  uploadDate: Date
  status: 'processing' | 'completed' | 'error'
  content?: string
  metadata?: ManuscriptMetadata
}

export interface ManuscriptMetadata {
  title?: string
  author?: string
  createdDate?: Date
  modifiedDate?: Date
}

// Dictionary types
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
  uploadDate: Date
  entries: DictionaryEntry[]
  itemCount: number
}

// Check Result types
export interface CheckResult {
  id: string
  type: 'typo' | 'terminology' | 'medical' | 'other'
  position: {
    start: number
    end: number
  }
  originalText: string
  suggestion?: string
  message: string
  severity: 'error' | 'warning' | 'info'
  reviewed: boolean
  editorDecision?: 'apply' | 'ignore'
  editorComment?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
