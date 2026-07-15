import { useState } from 'react'
import { CheckResult } from '../types/index'

interface CheckResultsProps {
  results: CheckResult[]
  manuscript: any
  onUpdateResult?: (resultId: string, decision: string, comment?: string) => void
}

export function CheckResults({ results, manuscript, onUpdateResult }: CheckResultsProps) {
  const [expandedResult, setExpandedResult] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">チェック結果がありません</p>
      </div>
    )
  }

  // Apply filters
  const filteredResults = results.filter(
    r =>
      (filterType === 'all' || r.type === filterType) &&
      (filterSeverity === 'all' || r.severity === filterSeverity)
  )

  // Calculate statistics
  const stats = {
    total: results.length,
    errors: results.filter(r => r.severity === 'error').length,
    warnings: results.filter(r => r.severity === 'warning').length,
    info: results.filter(r => r.severity === 'info').length,
    reviewed: results.filter(r => r.reviewed).length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">合計</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">エラー</p>
          <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">警告</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.warnings}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">情報</p>
          <p className="text-2xl font-bold text-blue-600">{stats.info}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">確認済み</p>
          <p className="text-2xl font-bold text-green-600">{stats.reviewed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">タイプ</label>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">すべて</option>
            <option value="typo">誤字脱字</option>
            <option value="terminology">用語</option>
            <option value="medical">医療関連</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">重要度</label>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">すべて</option>
            <option value="error">エラー</option>
            <option value="warning">警告</option>
            <option value="info">情報</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        {filteredResults.length === 0 ? (
          <div className="p-4 text-center text-gray-500">該当する指摘事項がありません</div>
        ) : (
          filteredResults.map(result => (
            <div
              key={result.id}
              className={`p-4 border-l-4 cursor-pointer transition-colors ${
                result.severity === 'error'
                  ? 'border-l-red-500 bg-red-50 hover:bg-red-100'
                  : result.severity === 'warning'
                  ? 'border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                  : 'border-l-blue-500 bg-blue-50 hover:bg-blue-100'
              }`}
              onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700 uppercase">{result.type}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        result.severity === 'error'
                          ? 'bg-red-200 text-red-800'
                          : result.severity === 'warning'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}
                    >
                      {result.severity}
                    </span>
                    {result.reviewed && (
                      <span className="text-xs px-2 py-1 rounded bg-green-200 text-green-800">✓ 確認済み</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{result.message}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    位置: {result.position.start}-{result.position.end}
                  </p>
                </div>
              </div>

              {/* Expanded details */}
              {expandedResult === result.id && (
                <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-3">
                  {/* Original text */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">原文:</p>
                    <p className="text-sm bg-white p-2 rounded border border-gray-300 font-mono">
                      {result.originalText}
                    </p>
                  </div>

                  {/* Suggestion */}
                  {result.suggestion && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">提案:</p>
                      <p className="text-sm bg-white p-2 rounded border border-gray-300 font-mono text-green-700">
                        {result.suggestion}
                      </p>
                    </div>
                  )}

                  {/* Editor decision */}
                  {!result.reviewed ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">判定:</p>
                      <div className="flex gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            onUpdateResult?.(result.id, 'apply')
                          }}
                          className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          適用
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            onUpdateResult?.(result.id, 'ignore')
                          }}
                          className="flex-1 px-3 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                        >
                          スキップ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">判定済み:</p>
                      <p
                        className={`text-sm px-2 py-1 rounded ${
                          result.editorDecision === 'apply'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {result.editorDecision === 'apply' ? '✓ 適用' : '✗ スキップ'}
                      </p>
                    </div>
                  )}

                  {/* Editor comment */}
                  {result.editorComment && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">エディタコメント:</p>
                      <p className="text-sm bg-white p-2 rounded border border-gray-300">
                        {result.editorComment}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
