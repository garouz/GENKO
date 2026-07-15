import { Response } from 'express'
import PDFDocument from 'pdfkit'

export class ExportService {
  // Export to Word (DOCX)
  // Note: For phase 1, we'll return the marked corrections
  // Full DOCX export will be implemented in phase 2
  static exportToDocx(manuscriptId: string, originalText: string, corrections: any[]): Buffer {
    // Apply corrections to text
    let correctedText = originalText
    
    // Sort corrections by position (reverse order to maintain positions)
    const sortedCorrections = [...corrections]
      .filter(c => c.editorDecision === 'apply')
      .sort((a, b) => b.position.start - a.position.start)
    
    sortedCorrections.forEach(correction => {
      if (correction.suggestion) {
        const { start, end } = correction.position
        correctedText = 
          correctedText.substring(0, start) +
          correction.suggestion +
          correctedText.substring(end)
      }
    })
    
    // For now, return as plain text
    // Full DOCX implementation will use a library like docx or mammoth
    return Buffer.from(correctedText, 'utf-8')
  }

  // Export to PDF
  static exportToPdf(manuscriptId: string, originalText: string, corrections: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument()
        const chunks: Buffer[] = []

        doc.on('data', (chunk: Buffer) => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        // Add header
        doc.fontSize(20).text('原稿校正レポート', 100, 50)
        doc.fontSize(12).text(`Manuscript ID: ${manuscriptId}`, 100, 80)
        doc.moveDown()

        // Add corrected text
        doc.fontSize(14).text('校正済みテキスト', { underline: true })
        doc.fontSize(10)

        let correctedText = originalText
        const sortedCorrections = [...corrections]
          .filter(c => c.editorDecision === 'apply')
          .sort((a, b) => b.position.start - a.position.start)

        sortedCorrections.forEach(correction => {
          if (correction.suggestion) {
            const { start, end } = correction.position
            correctedText =
              correctedText.substring(0, start) +
              correction.suggestion +
              correctedText.substring(end)
          }
        })

        doc.text(correctedText, { width: 500 })
        doc.moveDown()

        // Add corrections summary
        if (corrections.length > 0) {
          doc.addPage()
          doc.fontSize(14).text('校正サマリー', { underline: true })
          doc.fontSize(10)

          const summary = {
            total: corrections.length,
            applied: corrections.filter(c => c.editorDecision === 'apply').length,
            ignored: corrections.filter(c => c.editorDecision === 'ignore').length,
            errors: corrections.filter(c => c.severity === 'error').length,
            warnings: corrections.filter(c => c.severity === 'warning').length,
            info: corrections.filter(c => c.severity === 'info').length,
          }

          doc.text(`全指摘事項: ${summary.total}`)
          doc.text(`適用済み: ${summary.applied}`)
          doc.text(`未適用: ${summary.ignored}`)
          doc.moveDown()
          doc.text(`エラー: ${summary.errors}`)
          doc.text(`警告: ${summary.warnings}`)
          doc.text(`情報: ${summary.info}`)
        }

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Export to Markdown
  static exportToMarkdown(manuscriptId: string, originalText: string, corrections: any[]): Buffer {
    let markdown = `# 原稿校正レポート\n\n`
    markdown += `**Manuscript ID:** ${manuscriptId}\n`
    markdown += `**生成日時:** ${new Date().toISOString()}\n\n`

    // Add corrected text
    markdown += `## 校正済みテキスト\n\n`

    let correctedText = originalText
    const sortedCorrections = [...corrections]
      .filter(c => c.editorDecision === 'apply')
      .sort((a, b) => b.position.start - a.position.start)

    sortedCorrections.forEach(correction => {
      if (correction.suggestion) {
        const { start, end } = correction.position
        correctedText =
          correctedText.substring(0, start) +
          correction.suggestion +
          correctedText.substring(end)
      }
    })

    markdown += `\`\`\`\n${correctedText}\n\`\`\`\n\n`

    // Add corrections summary
    if (corrections.length > 0) {
      markdown += `## 校正サマリー\n\n`

      const summary = {
        total: corrections.length,
        applied: corrections.filter(c => c.editorDecision === 'apply').length,
        ignored: corrections.filter(c => c.editorDecision === 'ignore').length,
        errors: corrections.filter(c => c.severity === 'error').length,
        warnings: corrections.filter(c => c.severity === 'warning').length,
        info: corrections.filter(c => c.severity === 'info').length,
      }

      markdown += `| 項目 | 件数 |\n`
      markdown += `|------|------|\n`
      markdown += `| 全指摘事項 | ${summary.total} |\n`
      markdown += `| 適用済み | ${summary.applied} |\n`
      markdown += `| 未適用 | ${summary.ignored} |\n`
      markdown += `| エラー | ${summary.errors} |\n`
      markdown += `| 警告 | ${summary.warnings} |\n`
      markdown += `| 情報 | ${summary.info} |\n\n`

      // Add detailed corrections
      markdown += `## 指摘事項一覧\n\n`
      corrections.forEach((correction, index) => {
        markdown += `### ${index + 1}. ${correction.type.toUpperCase()}\n\n`
        markdown += `- **位置:** ${correction.position.start}-${correction.position.end}\n`
        markdown += `- **原文:** \`${correction.originalText}\`\n`
        markdown += `- **提案:** \`${correction.suggestion || 'N/A'}\`\n`
        markdown += `- **メッセージ:** ${correction.message}\n`
        markdown += `- **重要度:** ${correction.severity}\n`
        markdown += `- **判定:** ${correction.editorDecision || '未判定'}\n`
        if (correction.editorComment) {
          markdown += `- **エディタコメント:** ${correction.editorComment}\n`
        }
        markdown += `\n`
      })
    }

    return Buffer.from(markdown, 'utf-8')
  }
}
