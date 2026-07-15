import { Manuscript } from '../types/index.js'
import { v4 as uuidv4 } from 'uuid'

// In-memory storage (replace with database in production)
const manuscripts: Map<string, Manuscript> = new Map()

export const ManuscriptService = {
  // Create a new manuscript record
  create: (name: string, originalName: string): Manuscript => {
    const id = uuidv4()
    const manuscript: Manuscript = {
      id,
      name,
      originalName,
      uploadDate: new Date(),
      status: 'processing',
    }
    manuscripts.set(id, manuscript)
    return manuscript
  },

  // Get manuscript by ID
  getById: (id: string): Manuscript | undefined => {
    return manuscripts.get(id)
  },

  // Get all manuscripts
  getAll: (): Manuscript[] => {
    return Array.from(manuscripts.values())
  },

  // Update manuscript
  update: (id: string, updates: Partial<Manuscript>): Manuscript | undefined => {
    const manuscript = manuscripts.get(id)
    if (!manuscript) return undefined
    const updated = { ...manuscript, ...updates }
    manuscripts.set(id, updated)
    return updated
  },

  // Delete manuscript
  delete: (id: string): boolean => {
    return manuscripts.delete(id)
  },
}
