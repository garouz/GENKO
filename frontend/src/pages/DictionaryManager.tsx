import { useState } from 'react'
import { DictionaryUploader } from '../components/DictionaryUploader'
import { DictionaryList } from '../components/DictionaryList'

export function DictionaryManager() {
  const [dictionaries, setDictionaries] = useState<any[]>([])

  const handleUpload = async (file: File) => {
    // TODO: Implement dictionary upload logic
    console.log('Dictionary uploaded:', file.name)
    
    const newDict = {
      id: Date.now(),
      name: file.name,
      uploadDate: new Date(),
      itemCount: 0,
    }
    
    setDictionaries([...dictionaries, newDict])
  }

  return (
    <div className="space-y-8">
      {/* Dictionary Upload */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">用語辞書インポート</h2>
        <p className="text-gray-600 mb-4">CSV / JSON 形式の用語辞書ファイルをアップロードしてください</p>
        <DictionaryUploader onUpload={handleUpload} />
      </section>

      {/* Dictionary List */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">登録済み辞書</h2>
        <DictionaryList dictionaries={dictionaries} />
      </section>
    </div>
  )
}
