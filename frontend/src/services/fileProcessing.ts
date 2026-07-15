import * as mammoth from 'mammoth'

export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export function parseCsvDictionary(csvContent: string): any[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',')
  const entries = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const entry: any = {}

    headers.forEach((header, index) => {
      entry[header.trim()] = values[index]?.trim() || ''
    })

    if (entry.correctTerm) {
      entry.alternativeForms = entry.alternativeForms
        ? entry.alternativeForms.split('|').map((s: string) => s.trim())
        : []
      entries.push(entry)
    }
  }

  return entries
}

export function parseJsonDictionary(jsonContent: string): any[] {
  try {
    const data = JSON.parse(jsonContent)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
