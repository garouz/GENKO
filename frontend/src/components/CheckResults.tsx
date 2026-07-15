interface CheckResultsProps {
  results: any[]
  manuscript: any
}

export function CheckResults({ results, manuscript }: CheckResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">チェック結果がありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Result Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">エラー</p>
          <p className="text-2xl font-bold text-red-600">0</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">警告</p>
          <p className="text-2xl font-bold text-yellow-600">0</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">情報</p>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900">指摘事項</p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {/* Results will be displayed here */}
          <p className="text-gray-500 text-sm">指摘事項はまだありません</p>
        </div>
      </div>
    </div>
  )
}
