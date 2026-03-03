import { Box, Typography } from '@mui/material'

const AnimatedProgresioLogo = () => {
  return (
    <svg
      fill='none'
      height='80'
      viewBox='0 0 40 40'
      width='80'
      style={{
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
        `}
      </style>
      <path
        clipRule='evenodd'
        d='M20 5L10 20H15L20 12L25 20H30L20 5Z'
        fill='#0F172A'
        fillRule='evenodd'
      />
      <path d='M12 25L20 35L28 25H23L20 30L17 25H12Z' fill='#0F172A' />
    </svg>
  )
}

export default function RedirectLoader({ message = 'Redirecting...' }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <AnimatedProgresioLogo />
      </Box>
      <Typography
        sx={{
          color: '#0F172A',
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}
