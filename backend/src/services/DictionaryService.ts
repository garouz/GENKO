import { Dictionary, DictionaryEntry } from '../types/index.js'
import { v4 as uuidv4 } from 'uuid'

// In-memory storage (replace with database in production)
const dictionaries: Map<string, Dictionary> = new Map()

export const DictionaryService = {
  // Create a new dictionary
  create: (name: string, originalName: string, entries: DictionaryEntry[]): Dictionary => {
    const id = uuidv4()
    const dictionary: Dictionary = {
      id,
      name,
      originalName,
      uploadDate: new Date(),
      entries,
      itemCount: entries.length,
    }
    dictionaries.set(id, dictionary)
    return dictionary
  },

  // Get dictionary by ID
  getById: (id: string): Dictionary | undefined => {
    return dictionaries.get(id)
  },

  // Get all dictionaries
  getAll: (): Dictionary[] => {
    return Array.from(dictionaries.values())
  },

  // Add entries to dictionary
  addEntries: (id: string, entries: DictionaryEntry[]): Dictionary | undefined => {
    const dictionary = dictionaries.get(id)
    if (!dictionary) return undefined
    dictionary.entries.push(...entries)
    dictionary.itemCount = dictionary.entries.length
    dictionaries.set(id, dictionary)
    return dictionary
  },

  // Search dictionary entries
  searchEntry: (id: string, term: string): DictionaryEntry[] => {
    const dictionary = dictionaries.get(id)
    if (!dictionary) return []
    
    return dictionary.entries.filter(
      entry =>
        entry.correctTerm.includes(term) ||
        entry.alternativeForms.some(form => form.includes(term))
    )
  },

  // Delete dictionary
  delete: (id: string): boolean => {
    return dictionaries.delete(id)
  },
}
