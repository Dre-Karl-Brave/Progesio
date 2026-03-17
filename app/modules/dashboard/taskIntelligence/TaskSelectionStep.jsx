import { Box, Typography, Autocomplete, TextField, Chip } from '@mui/material'
import { AlertCircle } from 'lucide-react'

export default function TaskSelectionStep({ tasks, selectedTasks, onChangeSelectedTasks, error }) {
  return (
    <Box>
      {error && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={14} color='#DC2626' />
          <Typography sx={{ fontSize: 12, color: '#DC2626' }}>{error}</Typography>
        </Box>
      )}

      <Autocomplete
        multiple
        options={tasks}
        getOptionLabel={(option) => option.title}
        value={selectedTasks}
        onChange={(_e, val) => onChangeSelectedTasks(val)}
        slots={{}}
        slotProps={{
          listbox: { sx: { fontSize: 13, maxHeight: 240 } }
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.title}
              {...getTagProps({ index })}
              key={option.id}
              size='small'
              sx={{ fontSize: 11.5, height: 22, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px' }}
            />
          ))
        }
        renderOption={(props, option) => (
          <Box component='li' {...props} sx={{ py: '8px !important', px: '12px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
              <Typography sx={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{option.title}</Typography>
              <Chip
                label={option.columnName}
                size='small'
                sx={{ fontSize: 10, height: 18, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#64748B' }}
              />
            </Box>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={selectedTasks.length === 0 ? 'Search and select tasks...' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: 13,
                background: '#F8FAFC',
                '& fieldset': { borderColor: '#E2E8F0' },
                '&:hover fieldset': { borderColor: '#CBD5E1' },
                '&.Mui-focused fieldset': { borderColor: '#0F172A', borderWidth: '1.5px' }
              }
            }}
          />
        )}
        noOptionsText={<Typography sx={{ fontSize: 13, color: '#94A3B8' }}>No tasks found</Typography>}
      />

      <Typography sx={{ fontSize: 11, color: '#94A3B8', mt: 1.5 }}>
        {selectedTasks.length === 0
          ? 'Select at least one task to estimate.'
          : `${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''} selected.`}
      </Typography>
    </Box>
  )
}
