'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { Dialog, IconButton, Typography, Box, Button } from '@mui/material'
import { X, ChevronLeft } from 'lucide-react'
import FeatureSelectionStep from './taskIntelligence/FeatureSelectionStep'
import TaskSelectionStep from './taskIntelligence/TaskSelectionStep'
import LoadingStep from './taskIntelligence/LoadingStep'
import EstimateResultsStep from './taskIntelligence/EstimateResultsStep'
import { LOADING_MESSAGES, STEP_HEADER } from './taskIntelligence/constants'

const INITIAL_STATE = {
  selected: null,
  step: 'feature',
  selectedTasks: [],
  progress: 0,
  loadingMsg: LOADING_MESSAGES[0],
  results: [],
  error: ''
}

export default function TaskIntelligenceDialog({ open, onClose, onApply, tasks = [], boardId }) {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState('feature')
  const [selectedTasks, setSelectedTasks] = useState([])
  const [progress, setProgress] = useState(0)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const progressRef = useRef(null)
  const msgRef = useRef(null)

  const reset = () => {
    clearInterval(progressRef.current)
    clearInterval(msgRef.current)
    setSelected(INITIAL_STATE.selected)
    setStep(INITIAL_STATE.step)
    setSelectedTasks(INITIAL_STATE.selectedTasks)
    setProgress(INITIAL_STATE.progress)
    setLoadingMsg(INITIAL_STATE.loadingMsg)
    setResults(INITIAL_STATE.results)
    setError(INITIAL_STATE.error)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleRun = () => {
    if (selected === 'estimate') setStep('tasks')
  }

  const handleEstimate = async () => {
    if (selectedTasks.length === 0) return
    setStep('loading')
    setProgress(0)
    setError('')

    let p = 0
    progressRef.current = setInterval(() => {
      p += Math.random() * 6 + 2
      if (p >= 85) { p = 85; clearInterval(progressRef.current) }
      setProgress(Math.round(p))
    }, 400)

    let msgIdx = 0
    msgRef.current = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIdx])
    }, 1800)

    try {
      const res = await axios.post(`/api/boards/${boardId}/ai/estimate`, {
        taskIds: selectedTasks.map((t) => t.id)
      })
      clearInterval(progressRef.current)
      clearInterval(msgRef.current)
      setProgress(100)
      setTimeout(() => {
        setResults(res.data.estimates)
        setStep('results')
      }, 400)
    } catch (err) {
      clearInterval(progressRef.current)
      clearInterval(msgRef.current)
      setError(err.response?.data?.error || 'Something went wrong')
      setStep('tasks')
    }
  }

  const header = STEP_HEADER[step]
  const subtitle = step === 'results'
    ? `${results.length} task${results.length !== 1 ? 's' : ''} analyzed.`
    : header.subtitle

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: step === 'results' ? Math.min(560 + selectedTasks.length * 20, 720) : 560,
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
            overflow: 'hidden',
            transition: 'width 0.3s ease'
          }
        }
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3.5, pt: 3.5, pb: 2.5, borderBottom: '1px solid #F1F5F9' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {step === 'tasks' && (
              <IconButton
                onClick={() => setStep('feature')}
                size='small'
                sx={{ width: 26, height: 26, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#374151', '&:hover': { background: '#F1F5F9' } }}
              >
                <ChevronLeft size={13} strokeWidth={2} />
              </IconButton>
            )}
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.75 }}>
                AI Assistant
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0F172A', mb: 0.5 }}>
                {header.title}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            size='small'
            sx={{ width: 30, height: 30, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#374151', flexShrink: 0, '&:hover': { background: '#0F172A', borderColor: '#0F172A', color: '#fff' }, transition: 'all 0.15s ease' }}
          >
            <X size={13} strokeWidth={2} />
          </IconButton>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2.5 }}>
        {step === 'feature' && (
          <FeatureSelectionStep selected={selected} onSelect={setSelected} />
        )}
        {step === 'tasks' && (
          <TaskSelectionStep
            tasks={tasks}
            selectedTasks={selectedTasks}
            onChangeSelectedTasks={setSelectedTasks}
            error={error}
          />
        )}
        {step === 'loading' && (
          <LoadingStep progress={progress} loadingMsg={loadingMsg} taskCount={selectedTasks.length} />
        )}
        {step === 'results' && (
          <EstimateResultsStep results={results} selectedTasks={selectedTasks} />
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.75, borderTop: '1px solid #F1F5F9' }}>
        <Typography sx={{ fontSize: 11, color: '#64748B' }}>Powered by AI · Results may vary</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {step !== 'loading' && (
            <Button onClick={handleClose} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: 'transparent', '&:hover': { background: '#F1F5F9', borderColor: '#CBD5E1' }, transition: 'all 0.15s ease' }}>
              {step === 'results' ? 'Discard' : 'Cancel'}
            </Button>
          )}
          {step === 'feature' && (
            <Button onClick={handleRun} disabled={!selected} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, '&:disabled': { background: '#E2E8F0', borderColor: '#E2E8F0', color: '#94A3B8' }, transition: 'all 0.15s ease' }}>
              Run
            </Button>
          )}
          {step === 'tasks' && (
            <Button onClick={handleEstimate} disabled={selectedTasks.length === 0} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, '&:disabled': { background: '#E2E8F0', borderColor: '#E2E8F0', color: '#94A3B8' }, transition: 'all 0.15s ease' }}>
              Estimate
            </Button>
          )}
          {step === 'results' && (
            <Button
              onClick={() => { onApply?.(results, selectedTasks); handleClose() }}
              size='small'
              sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, transition: 'all 0.15s ease' }}
            >
              Apply
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}
