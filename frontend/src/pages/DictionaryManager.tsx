import { useState, useEffect } from 'react'
import { DictionaryUploader } from '../components/DictionaryUploader'
import { DictionaryList } from '../components/DictionaryList'
import { useApp } from '../store/AppContext'
import { parseCsvDictionary, parseJsonDictionary } from '../services/fileProcessing'

export function DictionaryManager() {
  const {
    dictionaries,
    loadDictionaries,
    createDictionary,
    error,
  } = useApp()

  useEffect(() => {
    loadDictionaries()
  }, [])

  const handleUpload = async (file: File) => {
    try {
      const content = await file.text()
      let entries = []

      if (file.name.endsWith('.csv')) {
        entries = parseCsvDictionary(content)
      } else if (file.name.endsWith('.json')) {
        entries = parseJsonDictionary(content)
      }

      if (entries.length === 0) {
        alert('\u6709\u52b9\u306a\u8f9e\u66f8\u30a8\u30f3\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093')
        return
      }

      await createDictionary(file.name, entries)
      alert(`\u8f9e\u66f8 "${file.name}" \u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u307e\u3057\u305f (${entries.length} \u9805\u76ee)`)
    } catch (err: any) {
      alert(`\u30a8\u30e9\u30fc: ${err.message}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Dictionary Upload */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">\u7528\u8a9e\u8f9e\u66f8\u30a4\u30f3\u30dd\u30fc\u30c8</h2>
        <p className="text-gray-600 mb-4">CSV / JSON \u5f62\u5f0f\u306e\u7528\u8a9e\u8f9e\u66f8\u30d5\u30a1\u30a4\u30eb\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u3066\u304f\u3060\u3055\u3044</p>
        <DictionaryUploader onUpload={handleUpload} />
      </section>

      {/* Dictionary List */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">\u767b\u9332\u6e08\u307f\u8f9e\u66f8</h2>
        <DictionaryList dictionaries={dictionaries} />
      </section>
    </div>
  )
}
