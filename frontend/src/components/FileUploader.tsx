import { useState, useRef } from 'react'

interface FileUploaderProps {
  onUpload: (file: File) => void
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.endsWith('.docx')) {
        onUpload(file)
      } else {
        alert('Word形式(.docx)ファイルをアップロードしてください')
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      onUpload(files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-300 bg-gray-50 hover:border-primary-400'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-16-8v16m-6-6l6 6 6-6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      <p className="mt-2 text-sm font-medium text-gray-900">
        クリックするか、ファイルをドラッグ&ドロップしてください
      </p>
      <p className="mt-1 text-xs text-gray-500">Word形式(.docx)のみ対応しています</p>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        ファイルを選択
      </button>
    </div>
  )
}
