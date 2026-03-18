import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  VerticalAlign
} from 'docx'

const SEVERITY_LABEL = { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' }

function divider() {
  return new Paragraph({
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0' }
    },
    spacing: { before: 160, after: 160 }
  })
}

function sectionHeading(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: '0F172A',
        font: 'Calibri'
      })
    ],
    spacing: { before: 320, after: 120 }
  })
}

function bottleneckCard(b, index) {
  const severityColors = {
    high: { bg: 'FEF2F2', text: '991B1B' },
    medium: { bg: 'FFFBEB', text: '92400E' },
    low: { bg: 'EFF6FF', text: '1E40AF' }
  }
  const sev = severityColors[b.severity] || severityColors.medium
  const label = SEVERITY_LABEL[b.severity] || 'Medium Risk'

  return [
    // Index + task title row
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        insideH: { style: BorderStyle.NONE },
        insideV: { style: BorderStyle.NONE }
      },
      rows: [
        // Title + severity badge row
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FAFAFA' },
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 120, bottom: 80, left: 160, right: 80 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: `${index}. `, bold: true, size: 22, color: '64748B', font: 'Calibri' }),
                    new TextRun({ text: b.title, bold: true, size: 22, color: '0F172A', font: 'Calibri' })
                  ]
                })
              ]
            }),
            new TableCell({
              shading: { type: ShadingType.CLEAR, color: 'auto', fill: sev.bg },
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 18, type: WidthType.PERCENTAGE },
              margins: { top: 120, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: label, bold: true, size: 18, color: sev.text, font: 'Calibri' })
                  ]
                })
              ]
            })
          ]
        }),
        // Column row
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FFFFFF' },
              columnSpan: 2,
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Column:  ', bold: true, size: 19, color: '374151', font: 'Calibri' }),
                    new TextRun({ text: b.column, size: 19, color: '64748B', font: 'Calibri' })
                  ]
                })
              ]
            })
          ]
        }),
        // Reasons row
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FFFFFF' },
              columnSpan: 2,
              margins: { top: 80, bottom: 120, left: 160, right: 160 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Issues:  ', bold: true, size: 19, color: '374151', font: 'Calibri' }),
                    new TextRun({ text: b.reasons.join('  ·  '), size: 19, color: '991B1B', font: 'Calibri' })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({ spacing: { after: 160 } })
  ]
}

export async function downloadBottleneckReport(summary, bottlenecks) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 }
          }
        },
        children: [
          // ── Title ──────────────────────────────────────────────
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun({
                text: 'Bottleneck Analysis Report',
                bold: true,
                size: 52,
                color: '0F172A',
                font: 'Calibri'
              })
            ],
            spacing: { after: 120 }
          }),

          // ── Date subtitle ──────────────────────────────────────
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${today}  ·  Powered by Progresio AI`,
                size: 20,
                color: '94A3B8',
                font: 'Calibri'
              })
            ],
            spacing: { after: 80 }
          }),

          divider(),

          // ── Summary section ────────────────────────────────────
          sectionHeading('AI Summary'),

          new Paragraph({
            children: [
              new TextRun({
                text: summary,
                size: 21,
                color: '374151',
                font: 'Calibri'
              })
            ],
            spacing: { after: 80 }
          }),

          divider(),

          // ── Bottlenecks section ────────────────────────────────
          sectionHeading(
            bottlenecks.length === 0
              ? 'No Bottlenecks Detected'
              : `Bottlenecks Detected  (${bottlenecks.length})`
          ),

          ...(bottlenecks.length === 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Your board is healthy — no bottleneck signals were found.',
                      size: 21,
                      color: '374151',
                      font: 'Calibri'
                    })
                  ]
                })
              ]
            : bottlenecks.flatMap((b, i) => bottleneckCard(b, i + 1))),

          divider(),

          // ── Footer note ────────────────────────────────────────
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'This report was generated automatically by Progresio AI. Results are based on current board state and may vary.',
                size: 17,
                color: '94A3B8',
                italics: true,
                font: 'Calibri'
              })
            ],
            spacing: { before: 160 }
          })
        ]
      }
    ]
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bottleneck-report-${new Date().toISOString().slice(0, 10)}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
