'use client'

import { Box, Typography } from '@mui/material'
import { CheckCircle, Clock, CalendarDays, Layers } from 'lucide-react'
import { useEffect, useState } from 'react'

// ── Palette ───────────────────────────────────────────
const PRIORITY_COLORS = {
  Urgent: '#EF4444',
  High:   '#F97316',
  Medium: '#EAB308',
  Low:    '#22C55E'
}

const COLUMN_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6', '#84CC16']
const LABEL_COLOR   = '#3B82F6'

// ── Sub-components ────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Box
      sx={{
        flex: 1,
        p: 1.5,
        borderRadius: '10px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
        <Icon size={12} color='#94A3B8' />
        <Typography sx={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 500 }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 10.5, color: '#64748B' }}>{sub}</Typography>
      )}
    </Box>
  )
}

function HorizontalBarChart({ title, rows, colorFn }) {
  const [animated, setAnimated] = useState(false)
  const max = Math.max(...rows.map((r) => r.count), 1)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A', mb: 1.25 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.9 }}>
        {rows.map((row, i) => {
          const pct = Math.max((row.count / max) * 100, row.count > 0 ? 6 : 0)
          const color = colorFn(row.name, i)
          return (
            <Box key={row.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{ fontSize: 10.5, color: '#64748B', width: 68, textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={row.name}
              >
                {row.name}
              </Typography>
              <Box sx={{ flex: 1, height: 14, borderRadius: '99px', background: '#F1F5F9', overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: animated ? `${pct}%` : '0%',
                    height: '100%',
                    borderRadius: '99px',
                    background: color,
                    transition: `width ${0.5 + i * 0.08}s cubic-bezier(0.4, 0, 0.2, 1)`
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: 10.5, color: '#374151', width: 16, textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>
                {row.count}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

function SummarySection({ label, text }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A', mb: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: '#374151', lineHeight: 1.65 }}>
        {text}
      </Typography>
    </Box>
  )
}

// ── Main component ────────────────────────────────────

export default function InsightsResultsStep({ sprint, stats, summary }) {
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Sprint header */}
      <Box
        sx={{
          p: 1.75,
          borderRadius: '10px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0'
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F172A', mb: 0.4 }}>
          {sprint.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalendarDays size={11} color='#94A3B8' />
          <Typography sx={{ fontSize: 11.5, color: '#64748B' }}>
            {fmt(sprint.startDate)} – {fmt(sprint.endDate)} · {sprint.durationDays} days
          </Typography>
        </Box>
        {sprint.goal && (
          <Typography sx={{ fontSize: 11.5, color: '#64748B', mt: 0.5 }}>
            Goal: {sprint.goal}
          </Typography>
        )}
      </Box>

      {/* Key stat cards */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <StatCard
          icon={Layers}
          label='Total Tasks'
          value={stats.totalTasks}
        />
        <StatCard
          icon={CheckCircle}
          label='Completed'
          value={stats.byColumn.find((c) => /done|complete/i.test(c.name))?.count ?? '—'}
          sub={stats.totalTasks > 0 ? `of ${stats.totalTasks} tasks` : undefined}
        />
        <StatCard
          icon={Clock}
          label='Duration'
          value={`${sprint.durationDays}d`}
        />
        <StatCard
          icon={CalendarDays}
          label='On Time'
          value={sprint.onTime === true ? 'Yes' : sprint.onTime === false ? 'No' : '—'}
        />
      </Box>

      {/* Bar charts */}
      <Box sx={{ display: 'flex', gap: 2.5 }}>
        <HorizontalBarChart
          title='Tasks by Status'
          rows={stats.byColumn}
          colorFn={(_, i) => COLUMN_COLORS[i % COLUMN_COLORS.length]}
        />
        <Box sx={{ width: '1px', background: '#F1F5F9', flexShrink: 0 }} />
        <HorizontalBarChart
          title='Priority Mix'
          rows={stats.byPriority}
          colorFn={(name) => PRIORITY_COLORS[name] || '#6366F1'}
        />
        {stats.byLabel.length > 0 && (
          <>
            <Box sx={{ width: '1px', background: '#F1F5F9', flexShrink: 0 }} />
            <HorizontalBarChart
              title='Top Labels'
              rows={stats.byLabel}
              colorFn={() => LABEL_COLOR}
            />
          </>
        )}
      </Box>

      {/* AI Summary */}
      <Box
        sx={{
          p: 2,
          borderRadius: '10px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          AI Analysis
        </Typography>
        <SummarySection label='Overview'       text={summary.overview} />
        <SummarySection label='Delivery'       text={summary.delivery} />
        <SummarySection label='Priority & Focus' text={summary.priorityFocus} />
        <SummarySection label='Patterns'       text={summary.patterns} />
        <Box sx={{ pt: 0.5, borderTop: '1px solid #F1F5F9' }}>
          <SummarySection label='Recommendation' text={summary.recommendation} />
        </Box>
      </Box>
    </Box>
  )
}
