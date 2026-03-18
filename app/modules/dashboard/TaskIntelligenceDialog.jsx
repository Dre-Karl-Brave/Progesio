'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { Dialog, IconButton, Typography, Box, Button } from '@mui/material'
import { X, ChevronLeft } from 'lucide-react'
import FeatureSelectionStep from './taskIntelligence/FeatureSelectionStep'
import TaskSelectionStep from './taskIntelligence/TaskSelectionStep'
import LoadingStep from './taskIntelligence/LoadingStep'
import EstimateResultsStep from './taskIntelligence/EstimateResultsStep'
import SubtaskBreakdownStep from './taskIntelligence/SubtaskBreakdownStep'
import SubtaskResultsStep from './taskIntelligence/SubtaskResultsStep'
import OrganizeResultsStep from './taskIntelligence/OrganizeResultsStep'
import {
  ESTIMATE_LOADING_MESSAGES,
  SCAN_LOADING_MESSAGES,
  GENERATE_LOADING_MESSAGES,
  ORGANIZE_LOADING_MESSAGES,
  STEP_HEADER
} from './taskIntelligence/constants'

const BACK_MAP = { tasks: 'feature', 'select-breakdown': 'feature', 'organize-tasks': 'feature' }
const LOADING_STEPS = ['loading', 'scan-loading', 'generate-loading', 'organize-loading']

export default function TaskIntelligenceDialog({ open, onClose, onApply, onApplySubtasks, onApplyOrganize, tasks = [], boardId }) {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState('feature')

  // Estimate state
  const [selectedTasks, setSelectedTasks] = useState([])
  const [estimateResults, setEstimateResults] = useState([])

  // Subtask state
  const [bigTasks, setBigTasks] = useState([])
  const [checkedIds, setCheckedIds] = useState([])
  const [subtaskResults, setSubtaskResults] = useState([])
  const [deleteMainTasks, setDeleteMainTasks] = useState(false)

  // Organize state
  const [organizeSelectedTasks, setOrganizeSelectedTasks] = useState([])
  const [organizeResults, setOrganizeResults] = useState([])

  // Shared loading state
  const [progress, setProgress] = useState(0)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')
  const progressRef = useRef(null)
  const msgRef = useRef(null)

  const reset = () => {
    clearInterval(progressRef.current)
    clearInterval(msgRef.current)
    setSelected(null)
    setStep('feature')
    setSelectedTasks([])
    setEstimateResults([])
    setBigTasks([])
    setCheckedIds([])
    setSubtaskResults([])
    setDeleteMainTasks(false)
    setOrganizeSelectedTasks([])
    setOrganizeResults([])
    setProgress(0)
    setLoadingMsg('')
    setError('')
  }

  const handleClose = () => { reset(); onClose() }

  const startProgress = (messages) => {
    setProgress(0)
    setLoadingMsg(messages[0])
    let p = 0
    progressRef.current = setInterval(() => {
      p += Math.random() * 6 + 2
      if (p >= 85) { p = 85; clearInterval(progressRef.current) }
      setProgress(Math.round(p))
    }, 400)
    let idx = 0
    msgRef.current = setInterval(() => {
      idx = (idx + 1) % messages.length
      setLoadingMsg(messages[idx])
    }, 1800)
  }

  const finishProgress = () => {
    clearInterval(progressRef.current)
    clearInterval(msgRef.current)
    setProgress(100)
  }

  // ─── Estimate flow ────────────────────────────────────────────────────
  const handleRun = () => {
    if (selected === 'estimate') setStep('tasks')
    if (selected === 'subtasks') handleScan()
    if (selected === 'organize') setStep('organize-tasks')
  }

  const handleEstimate = async () => {
    if (selectedTasks.length === 0) return
    setStep('loading')
    setError('')
    startProgress(ESTIMATE_LOADING_MESSAGES)
    try {
      const res = await axios.post(`/api/boards/${boardId}/ai/estimate`, {
        taskIds: selectedTasks.map((t) => t.id)
      })
      finishProgress()
      setTimeout(() => { setEstimateResults(res.data.estimates); setStep('results') }, 400)
    } catch (err) {
      finishProgress()
      setError(err.response?.data?.error || 'Something went wrong')
      setStep('tasks')
    }
  }

  // ─── Subtask flow ─────────────────────────────────────────────────────
  const handleScan = async () => {
    setStep('scan-loading')
    setError('')
    startProgress(SCAN_LOADING_MESSAGES)
    try {
      const res = await axios.post(`/api/boards/${boardId}/ai/subtasks/scan`)
      finishProgress()
      setTimeout(() => {
        const found = res.data.bigTasks || []
        setBigTasks(found)
        setCheckedIds([])
        setStep('select-breakdown')
      }, 400)
    } catch (err) {
      finishProgress()
      setError(err.response?.data?.error || 'Something went wrong')
      setStep('feature')
    }
  }

  const handleGenerate = async () => {
    if (checkedIds.length === 0) return
    setStep('generate-loading')
    setError('')
    startProgress(GENERATE_LOADING_MESSAGES)
    try {
      const res = await axios.post(`/api/boards/${boardId}/ai/subtasks/generate`, {
        taskIds: checkedIds
      })
      finishProgress()
      setTimeout(() => { setSubtaskResults(res.data.subtasks || []); setStep('subtask-results') }, 400)
    } catch (err) {
      finishProgress()
      setError(err.response?.data?.error || 'Something went wrong')
      setStep('select-breakdown')
    }
  }

  const handleToggleCheck = (id) => {
    setCheckedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  // ─── Organize flow ────────────────────────────────────────────────────
  const handleOrganize = async () => {
    if (organizeSelectedTasks.length === 0) return
    setStep('organize-loading')
    setError('')
    startProgress(ORGANIZE_LOADING_MESSAGES)
    try {
      const res = await axios.post(`/api/boards/${boardId}/ai/organize`, {
        taskIds: organizeSelectedTasks.map((t) => t.id)
      })
      finishProgress()
      setTimeout(() => { setOrganizeResults(res.data.suggestions || []); setStep('organize-results') }, 400)
    } catch (err) {
      finishProgress()
      setError(err.response?.data?.error || 'Something went wrong')
      setStep('organize-tasks')
    }
  }

  // ─── Header ──────────────────────────────────────────────────────────
  const header = STEP_HEADER[step] || STEP_HEADER.feature
  const subtitle =
    step === 'results'
      ? `${estimateResults.length} task${estimateResults.length !== 1 ? 's' : ''} analyzed.`
      : step === 'subtask-results'
      ? `${subtaskResults.reduce((n, r) => n + r.items.length, 0)} subtasks ready across ${subtaskResults.length} task${subtaskResults.length !== 1 ? 's' : ''}.`
      : step === 'organize-results'
      ? `${organizeResults.filter((s) => s.changed).length} change${organizeResults.filter((s) => s.changed).length !== 1 ? 's' : ''} suggested across ${organizeResults.length} task${organizeResults.length !== 1 ? 's' : ''}.`
      : header.subtitle

  const isLoading = LOADING_STEPS.includes(step)
  const backStep = BACK_MAP[step]
  const loadingTaskCount =
    step === 'loading' ? selectedTasks.length
    : step === 'scan-loading' ? tasks.length
    : step === 'generate-loading' ? checkedIds.length
    : step === 'organize-loading' ? organizeSelectedTasks.length
    : null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: ['results', 'subtask-results'].includes(step) ? 620 : 560,
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
            {backStep && (
              <IconButton
                onClick={() => setStep(backStep)}
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
          <IconButton onClick={handleClose} size='small' sx={{ width: 30, height: 30, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#374151', flexShrink: 0, '&:hover': { background: '#0F172A', borderColor: '#0F172A', color: '#fff' }, transition: 'all 0.15s ease' }}>
            <X size={13} strokeWidth={2} />
          </IconButton>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2.5, maxHeight: 420, overflowY: 'auto' }}>
        {step === 'feature' && <FeatureSelectionStep selected={selected} onSelect={setSelected} />}
        {step === 'tasks' && <TaskSelectionStep tasks={tasks} selectedTasks={selectedTasks} onChangeSelectedTasks={setSelectedTasks} error={error} />}
        {isLoading && <LoadingStep progress={progress} loadingMsg={loadingMsg} taskCount={loadingTaskCount} />}
        {step === 'results' && <EstimateResultsStep results={estimateResults} selectedTasks={selectedTasks} />}
        {step === 'select-breakdown' && <SubtaskBreakdownStep bigTasks={bigTasks} tasks={tasks} checkedIds={checkedIds} onToggle={handleToggleCheck} error={error} />}
        {step === 'subtask-results' && <SubtaskResultsStep subtaskResults={subtaskResults} tasks={tasks} deleteMainTasks={deleteMainTasks} onDeleteMainTasksChange={setDeleteMainTasks} />}
        {step === 'organize-tasks' && <TaskSelectionStep tasks={tasks} selectedTasks={organizeSelectedTasks} onChangeSelectedTasks={setOrganizeSelectedTasks} error={error} />}
        {step === 'organize-results' && <OrganizeResultsStep suggestions={organizeResults} selectedTasks={organizeSelectedTasks} />}
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.75, borderTop: '1px solid #F1F5F9' }}>
        <Typography sx={{ fontSize: 11, color: '#64748B' }}>Powered by AI · Results may vary</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isLoading && (
            <Button onClick={handleClose} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: 'transparent', '&:hover': { background: '#F1F5F9', borderColor: '#CBD5E1' }, transition: 'all 0.15s ease' }}>
              {['results', 'subtask-results', 'organize-results'].includes(step) ? 'Discard' : 'Cancel'}
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
          {step === 'select-breakdown' && (
            <Button onClick={handleGenerate} disabled={checkedIds.length === 0} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, '&:disabled': { background: '#E2E8F0', borderColor: '#E2E8F0', color: '#94A3B8' }, transition: 'all 0.15s ease' }}>
              Generate subtasks
            </Button>
          )}
          {step === 'results' && (
            <Button onClick={() => { onApply?.(estimateResults, selectedTasks); handleClose() }} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, transition: 'all 0.15s ease' }}>
              Apply
            </Button>
          )}
          {step === 'subtask-results' && (
            <Button onClick={() => { onApplySubtasks?.(subtaskResults, tasks, deleteMainTasks); handleClose() }} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, transition: 'all 0.15s ease' }}>
              Apply
            </Button>
          )}
          {step === 'organize-tasks' && (
            <Button onClick={handleOrganize} disabled={organizeSelectedTasks.length === 0} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, '&:disabled': { background: '#E2E8F0', borderColor: '#E2E8F0', color: '#94A3B8' }, transition: 'all 0.15s ease' }}>
              Analyze
            </Button>
          )}
          {step === 'organize-results' && (
            <Button onClick={() => { onApplyOrganize?.(organizeResults); handleClose() }} size='small' sx={{ fontSize: 12, fontWeight: 500, color: '#fff', border: '1px solid #0F172A', borderRadius: '8px', px: 2, py: 0.75, textTransform: 'none', background: '#0F172A', '&:hover': { background: '#1E293B' }, transition: 'all 0.15s ease' }}>
              Apply
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}
