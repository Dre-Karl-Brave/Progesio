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

export const LOADING_MESSAGES = [
  'Analyzing task complexity...',
  'Reviewing scope and requirements...',
  'Calculating effort estimate...',
  'Assessing dependencies...',
  'Finalizing results...'
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
    subtitle: 'Let AI analyze and enhance the selected task with intelligent suggestions.'
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
  }
}
