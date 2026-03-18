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

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0' } },
    spacing: { before: 160, after: 160 }
  })
}

function sectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26, color: '0F172A', font: 'Calibri' })],
    spacing: { before: 320, after: 140 }
  })
}

function subHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 21, color: '0F172A', font: 'Calibri' })],
    spacing: { before: 200, after: 80 }
  })
}

function bodyText(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 21, color: '374151', font: 'Calibri' })],
    spacing: { after: 80 },
    indent: { left: 160 }
  })
}

function statsTable(rows) {
  return new Table({
    width: { size: 60, type: WidthType.PERCENTAGE },
    borders: {
      top:     { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      bottom:  { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      left:    { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      right:   { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      insideH: { style: BorderStyle.SINGLE, size: 2, color: 'F1F5F9' },
      insideV: { style: BorderStyle.NONE }
    },
    rows: rows.map(([label, value], i) =>
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: i % 2 === 0 ? 'F8FAFC' : 'FFFFFF' },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: label, size: 19, color: '64748B', font: 'Calibri' })] })]
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: i % 2 === 0 ? 'F8FAFC' : 'FFFFFF' },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: String(value), bold: true, size: 19, color: '0F172A', font: 'Calibri' })] })]
          })
        ]
      })
    )
  })
}

export async function downloadInsightsReport(sprint, stats, summary) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  const completedCount = stats.byColumn.find((c) => /done|complete/i.test(c.name))?.count ?? '—'

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
    sections: [{
      properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      children: [
        // Title
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [new TextRun({ text: 'Sprint Insights Report', bold: true, size: 52, color: '0F172A', font: 'Calibri' })],
          spacing: { after: 120 }
        }),

        // Date line
        new Paragraph({
          children: [new TextRun({ text: `Generated on ${today}  ·  Powered by Progresio AI`, size: 20, color: '94A3B8', font: 'Calibri' })],
          spacing: { after: 80 }
        }),

        divider(),

        // Sprint details
        sectionHeading('Sprint Details'),
        statsTable([
          ['Sprint name',  sprint.name],
          ['Goal',         sprint.goal || 'No goal set'],
          ['Start date',   fmt(sprint.startDate)],
          ['End date',     fmt(sprint.endDate)],
          ['Completed on', fmt(sprint.completedAt)],
          ['Duration',     `${sprint.durationDays} days`],
          ['On time',      sprint.onTime === true ? 'Yes' : sprint.onTime === false ? 'No' : 'Unknown'],
        ]),

        divider(),

        // Statistics
        sectionHeading('Sprint Statistics'),

        subHeading('Tasks by Status'),
        statsTable(stats.byColumn.map((c) => [c.name, `${c.count} task${c.count !== 1 ? 's' : ''}`])),

        subHeading('Priority Distribution'),
        statsTable(stats.byPriority.map((p) => [p.name, `${p.count} task${p.count !== 1 ? 's' : ''}`])),

        ...(stats.byLabel.length > 0 ? [
          subHeading('Top Labels'),
          statsTable(stats.byLabel.map((l) => [l.name, `${l.count} task${l.count !== 1 ? 's' : ''}`]))
        ] : []),

        new Paragraph({
          children: [
            new TextRun({ text: `Total tasks: `, bold: true, size: 21, color: '0F172A', font: 'Calibri' }),
            new TextRun({ text: `${stats.totalTasks}`, size: 21, color: '374151', font: 'Calibri' }),
            new TextRun({ text: `   ·   Completed: `, bold: true, size: 21, color: '0F172A', font: 'Calibri' }),
            new TextRun({ text: `${completedCount}`, size: 21, color: '374151', font: 'Calibri' })
          ],
          spacing: { before: 200, after: 80 }
        }),

        divider(),

        // AI Analysis
        sectionHeading('AI Analysis'),

        subHeading('Overview'),
        bodyText(summary.overview),

        subHeading('Delivery'),
        bodyText(summary.delivery),

        subHeading('Priority & Focus'),
        bodyText(summary.priorityFocus),

        subHeading('Patterns'),
        bodyText(summary.patterns),

        subHeading('Recommendation'),
        bodyText(summary.recommendation),

        divider(),

        // Footer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'This report was generated automatically by Progresio AI. Results are based on sprint data at the time of generation.', size: 17, color: '94A3B8', italics: true, font: 'Calibri' })],
          spacing: { before: 160 }
        })
      ]
    }]
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sprint-insights-${sprint.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
