import { useState, useEffect } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ManuscriptList } from '../components/ManuscriptList'
import { CheckResults } from '../components/CheckResults'
import { useApp } from '../store/AppContext'
import { extractTextFromDocx } from '../services/fileProcessing'

export function Dashboard() {
  const {
    manuscripts,
    dictionaries,
    selectedManuscript,
    checkResults,
    loading,
    error,
    loadManuscripts,
    loadDictionaries,
    selectManuscript,
    createManuscript,
    runCheck,
  } = useApp()

  useEffect(() => {
    loadManuscripts()
    loadDictionaries()
  }, [])

  const handleFileUpload = async (file: File) => {
    try {
      // Create manuscript record
      await createManuscript(file.name)

      // Extract text from DOCX
      const text = await extractTextFromDocx(file)

      // Get the last created manuscript
      await loadManuscripts()

      // Show success message
      alert(`\u539f\u7a3f "${file.name}" \u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u307e\u3057\u305f`)
    } catch (err: any) {
      alert(`\u30a8\u30e9\u30fc: ${err.message}`)
    }
  }

  const handleSelectManuscript = (manuscript: any) => {
    selectManuscript(manuscript)
  }

  const handleRunCheck = async () => {
    if (!selectedManuscript) return

    try {
      const text = selectedManuscript.content || ''
      const dictionaryIds = dictionaries.map(d => d.id)
      await runCheck(selectedManuscript.id, text, dictionaryIds)
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

      {/* File Upload Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">\u539f\u7a3f\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9</h2>
        <FileUploader onUpload={handleFileUpload} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manuscript List */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">\u539f\u7a3f\u4e00\u89a7</h2>
            <ManuscriptList
              manuscripts={manuscripts}
              selectedId={selectedManuscript?.id}
              onSelect={handleSelectManuscript}
            />
          </section>
        </div>

        {/* Check Results */}
        <div className="lg:col-span-2">
          {selectedManuscript ? (
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedManuscript.name} - \u30c1\u30a7\u30c3\u30af\u7d50\u679c
                </h2>
                <button
                  onClick={handleRunCheck}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
                >
                  {loading ? '\u51e6\u7406\u4e2d...' : '\u30c1\u30a7\u30c3\u30af\u5b9f\u884c'}
                </button>
              </div>
              <CheckResults results={checkResults} manuscript={selectedManuscript} />
            </section>
          ) : (
            <section className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center py-12">\u539f\u7a3f\u3092\u9078\u629e\u3057\u3066\u30c1\u30a7\u30c3\u30af\u7d50\u679c\u3092\u8868\u793a\u3057\u307e\u3059</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
