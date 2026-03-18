'use client'

import { Box, Typography } from '@mui/material'
import { AlertTriangle, CheckCircle } from 'lucide-react'

const SEVERITY_CONFIG = {
  high:   { label: 'High',   bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
  medium: { label: 'Medium', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  low:    { label: 'Low',    bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' }
}

export default function BottleneckResultsStep({ summary, bottlenecks }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* AI summary */}
      <Box
        sx={{
          p: 2,
          borderRadius: '10px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          display: 'flex',
          gap: 1.25,
          alignItems: 'flex-start'
        }}
      >
        <AlertTriangle size={14} color='#D97706' style={{ flexShrink: 0, marginTop: 2 }} />
        <Typography sx={{ fontSize: 12.5, color: '#78350F', lineHeight: 1.65 }}>{summary}</Typography>
      </Box>

      {bottlenecks.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <CheckCircle size={20} color='#22C55E' />
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            No bottlenecks detected. Your board looks healthy!
          </Typography>
        </Box>
      ) : (
        bottlenecks.map((b) => {
          const sev = SEVERITY_CONFIG[b.severity] || SEVERITY_CONFIG.medium
          return (
            <Box
              key={b.id}
              sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FAFAFA' }}
            >
              {/* Title + severity */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>
                  {b.title}
                </Typography>
                <Box
                  sx={{
                    fontSize: 10.5, fontWeight: 700, px: 1, py: 0.25, borderRadius: '5px',
                    background: sev.bg, color: sev.text, border: `1px solid ${sev.border}`,
                    whiteSpace: 'nowrap', flexShrink: 0
                  }}
                >
                  {sev.label} risk
                </Box>
              </Box>

              {/* Column badge */}
              <Box sx={{ mb: 1 }}>
                <Box
                  component='span'
                  sx={{
                    fontSize: 10, px: 1, py: 0.25, borderRadius: '4px',
                    background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0'
                  }}
                >
                  {b.column}
                </Box>
              </Box>

              {/* Reason chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {b.reasons.map((reason, i) => (
                  <Box
                    key={i}
                    sx={{
                      fontSize: 11, px: 1, py: 0.25, borderRadius: '5px',
                      background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA'
                    }}
                  >
                    {reason}
                  </Box>
                ))}
              </Box>
            </Box>
          )
        })
      )}
    </Box>
  )
}
