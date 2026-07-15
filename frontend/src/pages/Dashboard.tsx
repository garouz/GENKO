import { useState } from 'react'
import { FileUploader } from '../components/FileUploader'
import { ManuscriptList } from '../components/ManuscriptList'
import { CheckResults } from '../components/CheckResults'

export function Dashboard() {
  const [manuscripts, setManuscripts] = useState<any[]>([])
  const [selectedManuscript, setSelectedManuscript] = useState<any | null>(null)
  const [checkResults, setCheckResults] = useState<any[]>([])

  const handleFileUpload = async (file: File) => {
    // TODO: Implement file upload logic
    console.log('File uploaded:', file.name)
    
    const newManuscript = {
      id: Date.now(),
      name: file.name,
      uploadDate: new Date(),
      status: 'processing', // processing | completed | error
    }
    
    setManuscripts([...manuscripts, newManuscript])
  }

  const handleSelectManuscript = (manuscript: any) => {
    setSelectedManuscript(manuscript)
    // TODO: Fetch check results for the manuscript
    setCheckResults([])
  }

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">原稿アップロード</h2>
        <FileUploader onUpload={handleFileUpload} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manuscript List */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">原稿一覧</h2>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {selectedManuscript.name} - チェック結果
              </h2>
              <CheckResults results={checkResults} manuscript={selectedManuscript} />
            </section>
          ) : (
            <section className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center py-12">
                原稿を選択してチェック結果を表示します
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
