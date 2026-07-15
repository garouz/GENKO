const API_BASE_URL = 'http://localhost:3000/api'

export interface ApiErrorResponse {
  success: false
  error: string
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'API Error')
    }

    return response.json()
  }

  // Manuscripts
  async getManuscripts() {
    return this.request('/manuscripts')
  }

  async getManuscript(id: string) {
    return this.request(`/manuscripts/${id}`)
  }

  async createManuscript(name: string) {
    return this.request('/manuscripts', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  }

  async updateManuscript(id: string, data: any) {
    return this.request(`/manuscripts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteManuscript(id: string) {
    return this.request(`/manuscripts/${id}`, {
      method: 'DELETE',
    })
  }

  // Dictionaries
  async getDictionaries() {
    return this.request('/dictionaries')
  }

  async getDictionary(id: string) {
    return this.request(`/dictionaries/${id}`)
  }

  async createDictionary(name: string, entries: any[]) {
    return this.request('/dictionaries', {
      method: 'POST',
      body: JSON.stringify({ name, entries }),
    })
  }

  async deleteDictionary(id: string) {
    return this.request(`/dictionaries/${id}`, {
      method: 'DELETE',
    })
  }

  // Check Results
  async runCheck(manuscriptId: string, text: string, dictionaryIds: string[]) {
    return this.request('/check/manuscript', {
      method: 'POST',
      body: JSON.stringify({ manuscriptId, text, dictionaryIds }),
    })
  }

  async getCheckResults(manuscriptId: string) {
    return this.request(`/check/results/${manuscriptId}`)
  }

  async updateCheckResult(resultId: string, manuscriptId: string, editorDecision: string, editorComment?: string) {
    return this.request(`/check/result/${resultId}`, {
      method: 'PUT',
      body: JSON.stringify({ manuscriptId, editorDecision, editorComment }),
    })
  }
}

export const apiClient = new ApiClient()
