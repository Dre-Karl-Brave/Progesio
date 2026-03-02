import { Shadows } from '@mui/material'

const createShadow = (y, blur, opacity) => {
  return `0px ${y}px ${blur}px rgba(0, 0, 0, ${opacity})`
}

const designSystemShadows = {
  shadow1: createShadow(4, 4, 0.15),
  shadow2: createShadow(0, 12, 0.1),
  shadow3: createShadow(0, 12, 0.12),
  shadow4: createShadow(0, 15, 0.15)
}

export const shadows = [
  'none',
  designSystemShadows.shadow1,
  designSystemShadows.shadow2,
  designSystemShadows.shadow3,
  designSystemShadows.shadow4,
  ...Array(20).fill('none')
] 
