export const palette = {
  brand: {
    main: '#112D4E', // Oboda Blue
    light: '#DEEBF1', // Oboda Light
    dark: '#103459', // Blue 800
    orange: '#F78F27' // Oboda Orange
  },
  primary: {
    main: '#112D4E', // brand.main - Oboda Blue
    light: '#DEEBF1', // brand.light
    dark: '#103459', // brand.dark
    contrastText: '#FFFFFF'
  },
  // Black & White Colors
  black: '#121212',
  white: '#FFFFFF',
  // Grey Scale
  grey: {
    900: '#263238',
    800: '#37474F',
    700: '#455A64',
    600: '#546E7A',
    500: '#78909C',
    400: '#90A4AE',
    300: '#B0BEC5',
    200: '#CFD8DC',
    100: '#ECEFF1',
    50: '#F2F4F6'
  },
  blueScale: {
    900: '#16314D',
    800: '#103459',
    700: '#133B65',
    600: '#1C5C9A',
    500: '#226DB5',
    400: '#2473BD',
    300: '#5297DA',
    200: '#A9CBED',
    100: '#DCEAF7',
    50: '#EAF2FA'
  },
  // States
  states: {
    error: {
      900: '#7A1F0E',
      800: '#9B1C04',
      700: '#A42105',
      600: '#CA3B27',
      500: '#D73F0D',
      400: '#E7531F',
      300: '#F57141',
      200: '#FAB8A0',
      100: '#F8DDD3',
      50: '#FEEEE8',
      // Convenience aliases
      primary: '#D73F0D', // 500
      light: '#FEEEE8', // 50
      dark: '#A42105', // 700
      alt: '#E7531F', // 400
      background: '#FEEEE8' // 50
    },
    success: {
      900: '#1A4538',
      800: '#185240',
      700: '#1B5D48',
      600: '#2B8F70',
      500: '#309F7D',
      400: '#37B38B',
      300: '#62CEAD',
      200: '#B1E7D6',
      100: '#DFF5EE',
      50: '#ECF9F5',
      // Convenience aliases
      primary: '#309F7D', // 500
      light: '#ECF9F5', // 50
      dark: '#1B5D48', // 700
      alt: '#37B38B', // 400
      background: '#ECF9F5' // 50
    },
    info: {
      900: '#16314D',
      800: '#103459',
      700: '#133B65',
      600: '#1C5C9A',
      500: '#226DB5',
      400: '#2473BD',
      300: '#5297DA',
      200: '#A9CBED',
      100: '#DCEAF7',
      50: '#EAF2FA',
      // Convenience aliases
      primary: '#226DB5', // 500
      background: '#EAF2FA', // 50
      light: '#EAF2FA', // 50
      hover: '#EAF2FA80'
    },
    warning: {
      900: '#87460A',
      800: '#B45700',
      700: '#DF8200',
      600: '#E89300',
      500: '#F5A700',
      400: '#F9BA1A',
      300: '#FFC533',
      200: '#FFDD87',
      100: '#FFEFD0',
      50: '#FFF1E1',
      // Convenience aliases
      main: '#F5A700', // 500
      background: '#FFF1E1', // 50
      light: '#FFF1E1', // 50
      hover: '#FFF1E180'
    }
  },
  // Background
  background: {
    default: '#FAFBFC', // White
    overlay: '#334/5F40%' // Overlay
  },
  chips: {
    todo: {
      main: '#B54708',
      border: '#FEDF89',
      background: '#FFFAEB'
    },
    inProgress: {
      main: '#175CD3',
      border: '#B2DDFF',
      background: '#EFF8FF'
    },
    completed: {
      main: '#067647',
      border: '#ABEFC6',
      background: '#ECFDF3'
    }
  }
}
