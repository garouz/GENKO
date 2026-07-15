import { useState, useRef, useEffect } from 'react'
import { CheckResult } from '../types/index'
import { useApp } from '../store/AppContext'

interface EditorReviewProps {
  manuscript: any
  checkResults: CheckResult[]
}

export function EditorReview({ manuscript, checkResults }: EditorReviewProps) {
  const { updateCheckResult } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [comment, setComment] = useState('')
  const [showComment, setShowComment] = useState(false)

  const pendingResults = checkResults.filter(r => !r.reviewed)
  const currentResult = pendingResults[currentIndex]

  const handleApply = async () => {
    if (!currentResult) return
    try {
      await updateCheckResult(currentResult.id, 'apply', comment)
      setComment('')
      setShowComment(false)
      if (currentIndex < pendingResults.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    } catch (error) {
      console.error('Failed to update result:', error)
    }
  }

  const handleIgnore = async () => {
    if (!currentResult) return
    try {
      await updateCheckResult(currentResult.id, 'ignore', comment)
      setComment('')
      setShowComment(false)
      if (currentIndex < pendingResults.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    } catch (error) {
      console.error('Failed to update result:', error)
    }
  }

  if (pendingResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center py-12">
        <p className="text-gray-500">確認待ちの指摘事項はありません</p>
      </div>
    )
  }

  if (!currentResult) return null

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-900">エディタレビュー</h3>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {pendingResults.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / pendingResults.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Current result */}
      <div
        className={`p-4 rounded-lg border-l-4 ${
          currentResult.severity === 'error'
            ? 'border-l-red-500 bg-red-50'
            : currentResult.severity === 'warning'
            ? 'border-l-yellow-500 bg-yellow-50'
            : 'border-l-blue-500 bg-blue-50'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-gray-700 uppercase">{currentResult.type}</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{currentResult.message}</p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded font-semibold ${
              currentResult.severity === 'error'
                ? 'bg-red-200 text-red-800'
                : currentResult.severity === 'warning'
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-blue-200 text-blue-800'
            }`}
          >
            {currentResult.severity}
          </span>
        </div>

        {/* Original and suggestion */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">原文:</p>
            <p className="text-sm bg-white p-3 rounded border border-gray-300 font-mono">
              {currentResult.originalText}
            </p>
          </div>
          {currentResult.suggestion && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">提案:</p>
              <p className="text-sm bg-white p-3 rounded border border-green-300 font-mono text-green-700">
                {currentResult.suggestion}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comment section */}
      {showComment && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">エディタコメント (任意)</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="コメントを入力..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          適用
        </button>
        <button
          onClick={handleIgnore}
          className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 font-medium"
        >
          スキップ
        </button>
        <button
          onClick={() => setShowComment(!showComment)}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium"
        >
          💬
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← 前へ
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(pendingResults.length - 1, currentIndex + 1))}
          disabled={currentIndex === pendingResults.length - 1}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
