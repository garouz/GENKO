import { createContext, useContext, useState, ReactNode } from 'react'
import { Manuscript, Dictionary, CheckResult } from '../types/index'
import { apiClient } from '../services/api'

interface AppContextType {
  manuscripts: Manuscript[]
  dictionaries: Dictionary[]
  selectedManuscript: Manuscript | null
  checkResults: CheckResult[]
  loading: boolean
  error: string | null

  loadManuscripts: () => Promise<void>
  loadDictionaries: () => Promise<void>
  selectManuscript: (manuscript: Manuscript | null) => void
  createManuscript: (name: string) => Promise<void>
  runCheck: (manuscriptId: string, text: string, dictionaryIds: string[]) => Promise<void>
  updateCheckResult: (resultId: string, decision: string, comment?: string) => Promise<void>
  createDictionary: (name: string, entries: any[]) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([])
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null)
  const [checkResults, setCheckResults] = useState<CheckResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadManuscripts = async () => {
    try {
      setLoading(true)
      const response: any = await apiClient.getManuscripts()
      setManuscripts(response.data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadDictionaries = async () => {
    try {
      setLoading(true)
      const response: any = await apiClient.getDictionaries()
      setDictionaries(response.data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createManuscript = async (name: string) => {
    try {
      setLoading(true)
      const response: any = await apiClient.createManuscript(name)
      setManuscripts([...manuscripts, response.data])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const runCheck = async (manuscriptId: string, text: string, dictionaryIds: string[]) => {
    try {
      setLoading(true)
      const response: any = await apiClient.runCheck(manuscriptId, text, dictionaryIds)
      setCheckResults(response.data.results || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateCheckResult = async (resultId: string, decision: string, comment?: string) => {
    try {
      const ms = selectedManuscript
      if (!ms) throw new Error('No manuscript selected')
      await apiClient.updateCheckResult(resultId, ms.id, decision, comment)
      setCheckResults(
        checkResults.map(r =>
          r.id === resultId
            ? { ...r, reviewed: true, editorDecision: decision as any, editorComment: comment }
            : r
        )
      )
      setError(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const createDictionary = async (name: string, entries: any[]) => {
    try {
      setLoading(true)
      const response: any = await apiClient.createDictionary(name, entries)
      setDictionaries([...dictionaries, response.data])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppContext.Provider
      value={{
        manuscripts,
        dictionaries,
        selectedManuscript,
        checkResults,
        loading,
        error,
        loadManuscripts,
        loadDictionaries,
        selectManuscript: setSelectedManuscript,
        createManuscript,
        runCheck,
        updateCheckResult,
        createDictionary,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
