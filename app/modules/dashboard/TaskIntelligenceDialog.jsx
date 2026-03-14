'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, IconButton, Typography, Box, Button } from '@mui/material'
import { X, FileText, GitBranch, Clock } from 'lucide-react'

const actions = [
  {
    id: 'summarize',
    Icon: FileText,
    title: 'Summarize task',
    description: 'Generate a concise summary based on title, description, and activity.'
  },
  {
    id: 'subtasks',
    Icon: GitBranch,
    title: 'Generate subtasks',
    description: 'Break this task into smaller, actionable subtasks to track progress.'
  },
  {
    id: 'estimate',
    Icon: Clock,
    title: 'Estimate effort',
    description: 'Get an AI-powered effort estimate based on task complexity.'
  }
]

export default function TaskIntelligenceDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 580,
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3.5, pt: 3.5, pb: 2.5, borderBottom: '1px solid #F1F5F9' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#64748B',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 0.75
              }}
            >
              AI Assistant
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0F172A', mb: 0.5 }}>
              Task-level intelligence
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              Let AI analyze and enhance the selected task with intelligent suggestions.
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size='small'
            sx={{
              width: 30,
              height: 30,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#374151',
              flexShrink: 0,
              '&:hover': {
                background: '#0F172A',
                borderColor: '#0F172A',
                color: '#fff'
              },
              transition: 'all 0.15s ease'
            }}
          >
            <X size={13} strokeWidth={2} />
          </IconButton>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, p: 2.5 }}>
        {actions.map((action) => (
          <Box
            key={action.id}
            onClick={() => {
              console.log(action.id)
              onClose()
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 2.5,
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                background: '#F1F5F9',
                border: '1px solid #E2E8F0'
              }
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', mb: 1, lineHeight: 1.3 }}>
              {action.title}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: '#374151', lineHeight: 1.6, mb: 2.5 }}>
              {action.description}
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: '#fff',
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                mt: 'auto'
              }}
            >
              <action.Icon size={17} strokeWidth={1.8} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.75,
          borderTop: '1px solid #F1F5F9'
        }}
      >
        <Typography sx={{ fontSize: 11, color: '#64748B' }}>Powered by AI · Results may vary</Typography>
        <Button
          onClick={onClose}
          size='small'
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            px: 2,
            py: 0.75,
            textTransform: 'none',
            background: 'transparent',
            '&:hover': {
              background: '#F1F5F9',
              borderColor: '#CBD5E1'
            },
            transition: 'all 0.15s ease'
          }}
        >
          Cancel
        </Button>
      </Box>
    </Dialog>
  )
}
