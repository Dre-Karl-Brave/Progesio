'use client'

import { useState, useRef } from 'react'
import { Dialog, IconButton, Typography, Box, Button } from '@mui/material'
import { X, BarChart2, AlertTriangle, Users } from 'lucide-react'
import axios from 'axios'
import LoadingStep from './taskIntelligence/LoadingStep'
import BottleneckResultsStep from './boardIntelligence/BottleneckResultsStep'

const ACTIONS = [
  {
    id: 'bottlenecks',
    Icon: AlertTriangle,
    title: 'Detect bottlenecks',
    description: 'Identify tasks blocking progress, overdue, stale, or missing key planning data.'
  },
  {
    id: 'insights',
    Icon: BarChart2,
    title: 'Sprint insights',
    description: 'Get a breakdown of sprint health, trends, and predicted delivery timelines.'
  },
  {
    id: 'workload',
    Icon: Users,
    title: 'Workload balance',
    description: 'Analyze task distribution across team members and surface imbalances.'
  }
]

const BOTTLENECK_LOADING_MESSAGES = [
  'Scanning board tasks...',
  'Checking due date coverage...',
  'Identifying sprint gaps...',
  'Analyzing task activity...',
  'Detecting stale and overdue tasks...',
  'Compiling bottleneck report...'
]

const STEP_HEADER = {
  feature: {
    title: 'Board-level intelligence',
    subtitle: "Get a bird's-eye view of your board with AI-driven analysis and team insights."
  },
  'scan-loading': {
    title: 'Detecting Bottlenecks',
    subtitle: 'AI is scanning your board for risks, delays, and neglected tasks...'
  },
  'bottleneck-results': {
    title: 'Bottleneck Report',
    subtitle: null
  }
}

const LOADING_STEPS = ['scan-loading']

export default function BoardIntelligenceDialog({ open, onClose, boardId }) {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState('feature')
  const [progress, setProgress] = useState(0)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [summary, setSummary] = useState('')
  const [bottlenecks, setBottlenecks] = useState([])
  const [error, setError] = useState('')

  const progressInterval = useRef(null)
  const msgInterval = useRef(null)

  const isLoading = LOADING_STEPS.includes(step)

  const startProgress = (messages) => {
    setProgress(0)
    setLoadingMsg(messages[0])
    let pct = 0
    let msgIdx = 0

    progressInterval.current = setInterval(() => {
      pct = Math.min(pct + Math.random() * 6 + 2, 88)
      setProgress(Math.round(pct))
    }, 400)

    msgInterval.current = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length
      setLoadingMsg(messages[msgIdx])
    }, 2200)
  }

  const finishProgress = () => {
    clearInterval(progressInterval.current)
    clearInterval(msgInterval.current)
    setProgress(100)
  }

  const handleRun = () => {
    if (selected === 'bottlenecks') handleBottleneckScan()
  }

  const handleBottleneckScan = async () => {
    setStep('scan-loading')
    setError('')
    startProgress(BOTTLENECK_LOADING_MESSAGES)

    try {
      const res = await axios.post(`/api/boards/${boardId}/ai/bottlenecks`)
      finishProgress()
      setTimeout(() => {
        setSummary(res.data.summary || '')
        setBottlenecks(res.data.bottlenecks || [])
        setStep('bottleneck-results')
      }, 400)
    } catch (err) {
      finishProgress()
      setError(err.response?.data?.error || 'Something went wrong')
      setStep('feature')
    }
  }

  const handleClose = () => {
    clearInterval(progressInterval.current)
    clearInterval(msgInterval.current)
    setSelected(null)
    setStep('feature')
    setProgress(0)
    setLoadingMsg('')
    setSummary('')
    setBottlenecks([])
    setError('')
    onClose()
  }

  const header = STEP_HEADER[step] || STEP_HEADER.feature
  const showBack = step === 'bottleneck-results'

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: step === 'bottleneck-results' ? 600 : 580,
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
            overflow: 'hidden',
            transition: 'width 0.2s ease'
          }
        }
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3.5, pt: 3.5, pb: 2.5, borderBottom: '1px solid #F1F5F9' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.75 }}>
              AI Assistant
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0F172A', mb: 0.5 }}>
              {header.title}
            </Typography>
            {header.subtitle && (
              <Typography sx={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                {header.subtitle}
              </Typography>
            )}
            {step === 'bottleneck-results' && bottlenecks.length > 0 && (
              <Typography sx={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                {bottlenecks.length} bottleneck{bottlenecks.length !== 1 ? 's' : ''} detected across your board.
              </Typography>
            )}
            {step === 'bottleneck-results' && bottlenecks.length === 0 && (
              <Typography sx={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                Your board looks clean — no bottlenecks detected.
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={isLoading}
            size='small'
            sx={{
              width: 30, height: 30, border: '1px solid #E2E8F0', background: '#F8FAFC',
              color: '#374151', flexShrink: 0,
              '&:hover': { background: '#0F172A', borderColor: '#0F172A', color: '#fff' },
              '&:disabled': { opacity: 0.4 },
              transition: 'all 0.15s ease'
            }}
          >
            <X size={13} strokeWidth={2} />
          </IconButton>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2.5, maxHeight: 460, overflowY: 'auto' }}>
        {/* Error */}
        {error && step === 'feature' && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <Typography sx={{ fontSize: 12, color: '#DC2626' }}>{error}</Typography>
          </Box>
        )}

        {/* Feature selection */}
        {step === 'feature' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
            {ACTIONS.map((action) => {
              const isSelected = selected === action.id
              const isDisabled = action.id !== 'bottlenecks'
              return (
                <Box
                  key={action.id}
                  onClick={() => !isDisabled && setSelected(action.id)}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2.5,
                    borderRadius: '12px',
                    background: isSelected ? '#F0F4FF' : '#F8FAFC',
                    border: isSelected ? '1.5px solid #0F172A' : '1.5px solid transparent',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.45 : 1,
                    transition: 'all 0.15s ease',
                    '&:hover': isDisabled ? {} : {
                      background: isSelected ? '#F0F4FF' : '#F1F5F9',
                      border: isSelected ? '1.5px solid #0F172A' : '1.5px solid #E2E8F0'
                    }
                  }}
                >
                  {/* Radio indicator */}
                  <Box
                    sx={{
                      position: 'absolute', top: 8, right: 8, width: 12, height: 12,
                      borderRadius: '50%', border: isSelected ? '2px solid #0F172A' : '2px dashed #CBD5E1',
                      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected && <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: '#0F172A' }} />}
                  </Box>

                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', mb: 1, lineHeight: 1.3 }}>
                    {action.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: '#374151', lineHeight: 1.6, mb: 2.5 }}>
                    {action.description}
                  </Typography>
                  {isDisabled && (
                    <Box sx={{ fontSize: 10, color: '#94A3B8', mb: 1, fontStyle: 'italic' }}>Coming soon</Box>
                  )}
                  <Box
                    sx={{
                      width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '10px', background: isSelected ? '#0F172A' : '#fff',
                      border: '1px solid #E2E8F0', color: isSelected ? '#fff' : '#0F172A',
                      mt: 'auto', transition: 'all 0.15s ease'
                    }}
                  >
                    <action.Icon size={17} strokeWidth={1.8} />
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}

        {/* Loading */}
        {isLoading && (
          <LoadingStep progress={progress} loadingMsg={loadingMsg} taskCount={null} />
        )}

        {/* Bottleneck results */}
        {step === 'bottleneck-results' && (
          <BottleneckResultsStep summary={summary} bottlenecks={bottlenecks} />
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.75, borderTop: '1px solid #F1F5F9' }}>
        <Typography sx={{ fontSize: 11, color: '#64748B' }}>Powered by AI · Results may vary</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showBack && (
            <Button
              onClick={() => setStep('feature')}
              size='small'
              sx={{
                fontSize: 12, fontWeight: 500, color: '#0F172A', border: '1px solid #E2E8F0',
                borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: 'transparent',
                '&:hover': { background: '#F1F5F9', borderColor: '#CBD5E1' }, transition: 'all 0.15s ease'
              }}
            >
              Back
            </Button>
          )}
          <Button
            onClick={step === 'bottleneck-results' ? handleClose : isLoading ? undefined : handleClose}
            disabled={isLoading && step !== 'bottleneck-results'}
            size='small'
            sx={{
              fontSize: 12, fontWeight: 500, color: '#0F172A', border: '1px solid #E2E8F0',
              borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: 'transparent',
              '&:hover': { background: '#F1F5F9', borderColor: '#CBD5E1' },
              '&:disabled': { opacity: 0.4 },
              transition: 'all 0.15s ease'
            }}
          >
            {step === 'bottleneck-results' ? 'Close' : 'Cancel'}
          </Button>
          {step === 'feature' && (
            <Button
              onClick={handleRun}
              disabled={!selected}
              size='small'
              sx={{
                fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A',
                borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A',
                '&:hover': { background: '#1E293B', borderColor: '#1E293B' },
                '&:disabled': { background: '#E2E8F0', borderColor: '#E2E8F0', color: '#94A3B8' },
                transition: 'all 0.15s ease'
              }}
            >
              Run
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}
