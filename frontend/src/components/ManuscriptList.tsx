interface ManuscriptListProps {
  manuscripts: any[]
  selectedId?: number
  onSelect: (manuscript: any) => void
}

export function ManuscriptList({ manuscripts, selectedId, onSelect }: ManuscriptListProps) {
  if (manuscripts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">アップロードされた原稿がありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {manuscripts.map((manuscript) => (
        <button
          key={manuscript.id}
          onClick={() => onSelect(manuscript)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            selectedId === manuscript.id
              ? 'bg-primary-100 border-l-4 border-primary-600'
              : 'hover:bg-gray-100'
          }`}
        >
          <div className="font-medium text-sm text-gray-900">{manuscript.name}</div>
          <div className="text-xs text-gray-500 mt-1">
            {manuscript.uploadDate.toLocaleString('ja-JP')}
          </div>
          <div className="text-xs mt-2">
            {manuscript.status === 'processing' && (
              <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded">処理中</span>
            )}
            {manuscript.status === 'completed' && (
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">完了</span>
            )}
            {manuscript.status === 'error' && (
              <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded">エラー</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
