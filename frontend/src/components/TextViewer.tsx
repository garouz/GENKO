import { useState, useMemo } from 'react'
import { CheckResult, Manuscript } from '../types/index'

interface TextViewerProps {
  text: string
  checkResults: CheckResult[]
  onHighlightClick?: (result: CheckResult) => void
}

export function TextViewer({ text, checkResults, onHighlightClick }: TextViewerProps) {
  const [hoveredResult, setHoveredResult] = useState<string | null>(null)

  // Sort results by position (reverse for highlighting)
  const sortedResults = useMemo(
    () => [...checkResults].sort((a, b) => b.position.start - a.position.start),
    [checkResults]
  )

  // Build highlighted text
  const highlightedText = useMemo(() => {
    if (sortedResults.length === 0) return text

    let result = text
    const highlights: { start: number; end: number; result: CheckResult }[] = []

    // Collect non-overlapping highlights
    for (const checkResult of sortedResults) {
      const { start, end } = checkResult.position
      const overlaps = highlights.some(
        h => (start >= h.start && start < h.end) || (end > h.start && end <= h.end)
      )
      if (!overlaps) {
        highlights.push({ start, end, result: checkResult })
      }
    }

    // Sort by position (reverse)
    highlights.sort((a, b) => b.start - a.start)

    // Build highlighted segments
    const segments: any[] = []
    let lastEnd = text.length

    for (const { start, end, result: checkResult } of highlights) {
      if (end < lastEnd) {
        segments.unshift({
          type: 'text',
          content: text.substring(end, lastEnd),
        })
      }

      segments.unshift({
        type: 'highlight',
        content: text.substring(start, end),
        result: checkResult,
      })

      lastEnd = start
    }

    if (lastEnd > 0) {
      segments.unshift({
        type: 'text',
        content: text.substring(0, lastEnd),
      })
    }

    return segments
  }, [text, sortedResults])

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="prose prose-sm max-w-none">
        {Array.isArray(highlightedText) ? (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {highlightedText.map((segment, idx) => {
              if (segment.type === 'text') {
                return <span key={idx}>{segment.content}</span>
              } else {
                const { result } = segment
                const isHovered = hoveredResult === result.id
                return (
                  <span
                    key={idx}
                    className={`cursor-pointer rounded px-1 py-0.5 transition-all ${
                      result.severity === 'error'
                        ? `${isHovered ? 'bg-red-400' : 'bg-red-200'} text-red-900`
                        : result.severity === 'warning'
                        ? `${isHovered ? 'bg-yellow-400' : 'bg-yellow-200'} text-yellow-900`
                        : `${isHovered ? 'bg-blue-400' : 'bg-blue-200'} text-blue-900`
                    }`}
                    onMouseEnter={() => setHoveredResult(result.id)}
                    onMouseLeave={() => setHoveredResult(null)}
                    onClick={() => onHighlightClick?.(result)}
                    title={result.message}
                  >
                    {segment.content}
                  </span>
                )
              }
            })}
          </p>
        ) : (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{text}</p>
        )}
      </div>
    </div>
  )
}
