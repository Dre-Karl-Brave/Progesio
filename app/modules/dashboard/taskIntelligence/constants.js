import { Clock, GitBranch, LayoutList } from 'lucide-react'

export const ACTIONS = [
  {
    id: 'estimate',
    Icon: Clock,
    title: 'Estimate effort',
    description: 'Get an AI-powered effort estimate based on task complexity.'
  },
  {
    id: 'subtasks',
    Icon: GitBranch,
    title: 'Generate subtasks',
    description: 'Break this task into smaller, actionable subtasks to track progress.'
  },
  {
    id: 'organize',
    Icon: LayoutList,
    title: 'Organize tasks',
    description: 'Let AI prioritize and organize your tasks for maximum efficiency.'
  }
]

export const ESTIMATE_LOADING_MESSAGES = [
  'Analyzing task complexity...',
  'Reviewing scope and requirements...',
  'Calculating effort estimate...',
  'Assessing dependencies...',
  'Finalizing results...'
]

// Keep old name as alias for backward compat
export const LOADING_MESSAGES = ESTIMATE_LOADING_MESSAGES

export const SCAN_LOADING_MESSAGES = [
  'Scanning board tasks...',
  'Identifying complex tasks...',
  'Evaluating scope and breadth...',
  'Checking for breakdown candidates...',
  'Finalizing analysis...'
]

export const GENERATE_LOADING_MESSAGES = [
  'Reading task requirements...',
  'Drafting subtasks...',
  'Organizing work into steps...',
  'Reviewing coverage...',
  'Finalizing subtasks...'
]

export const COMPLEXITY_COLORS = {
  low: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  medium: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  high: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' }
}

export const CONFIDENCE_COLORS = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: '#22C55E'
}

export const STEP_HEADER = {
  feature: {
    title: 'Task-level intelligence',
    subtitle: 'Let AI analyze and enhance your tasks with intelligent suggestions.'
  },
  tasks: {
    title: 'Select tasks to estimate',
    subtitle: 'Choose one or more tasks for AI to estimate.'
  },
  loading: {
    title: 'Analyzing tasks...',
    subtitle: 'AI is reviewing your tasks — this takes just a moment.'
  },
  results: {
    title: 'Effort estimates',
    subtitle: null // dynamic
  },
  'scan-loading': {
    title: 'Scanning board...',
    subtitle: 'AI is identifying tasks that would benefit from a breakdown.'
  },
  'select-breakdown': {
    title: 'Select tasks to break down',
    subtitle: 'AI found tasks that are too broad. Pick which ones to split into subtasks.'
  },
  'generate-loading': {
    title: 'Generating subtasks...',
    subtitle: 'AI is breaking down your tasks into actionable steps.'
  },
  'subtask-results': {
    title: 'Generated subtasks',
    subtitle: null // dynamic
  }
}
