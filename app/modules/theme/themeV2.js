import { createTheme } from '@mui/material/styles'
import { palette } from './palette'
import { shadows } from './shadows'
import { shape } from './shape'
import { typography } from './typography'

export const themeV2 = createTheme({
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: palette.brand.light,
          '.MuiLinearProgress-bar': {
            backgroundColor: palette.brand.main
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'currentColor',
            opacity: 0.8
          },

          '&:focus-visible': {
            outline: `2px solid ${palette.brand.main}`,
            outlineOffset: '2px'
          },

          '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'all !important'
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 36,
          height: 20,
          padding: 0,
          margin: 6
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: palette.white,
            '& + .MuiSwitch-track': {
              backgroundColor: palette.brand.main,
              opacity: 1,
              border: 0
            }
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: palette.brand.main,
            border: '6px solid',
            borderColor: palette.white
          }
        },
        thumb: {
          width: 18,
          height: 18
        },
        track: {
          borderRadius: 10,
          border: `1px solid ${palette.grey[400]}`,
          backgroundColor: palette.grey[300],
          opacity: 1,
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true
      },
      styleOverrides: {
        root: {
          color: 'grey.400',
          '&.Mui-checked': {
            color: palette.brand.main
          },
          '&.MuiCheckbox-indeterminate': {
            color: palette.brand.main
          },
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: palette.blueScale[50]
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          ...typography.smallBodySemibold,
          padding: '8px 25px',
          borderRadius: shape.borderRadius.button,
          '&:focus-visible': {
            outline: `2px solid ${palette.brand.main}`,
            outlineOffset: '2px'
          },
          '&.MuiButton-containedError': {
            backgroundColor: palette.states.error[500],
            color: palette.white,
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: palette.states.error[500],
              opacity: 0.8
            }
          },
          '&.MuiButton-outlinedError': {
            color: palette.states.error[500],
            border: `1px solid ${palette.states.error[500]}`,
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: palette.states.error[50],
              borderColor: palette.states.error[500],
              color: palette.states.error[500]
            }
          },
          '&.MuiButton-outlinedSuccess': {
            color: palette.brand.main,
            border: `1px solid ${palette.brand.main}`,
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: palette.brand.light,
              borderColor: palette.brand.main,
              color: palette.brand.main
            }
          },
          '&.MuiButton-containedSuccess': {
            backgroundColor: palette.brand.main,
            color: palette.white,
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: palette.brand.main,
              opacity: 0.8
            }
          }
        },
        outlined: {
          color: palette.brand.main,
          border: `1px solid ${palette.brand.main}`,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: palette.blueScale[100],
            borderColor: palette.brand.main,
            color: palette.brand.main
          }
        },
        contained: {
          backgroundColor: palette.brand.main,
          color: palette.white,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: palette.brand.main,
            opacity: 0.8
          }
        },
        containedPrimary: {
          backgroundColor: palette.brand.main,
          color: palette.white,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: palette.brand.main,
            opacity: 0.8
          }
        }
      }
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius.button,
          padding: '6px 12px',
          backgroundColor: 'transparent',
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: palette.grey[100]
          },
          '&.Mui-disabled': {
            opacity: 0.5
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: palette.brand.main,
            outlineOffset: '2px'
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius.default
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.white,
          boxShadow: shadows[2],
          position: 'relative',
          zIndex: 2
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          padding: '16px 24px',
          borderBottom: `1px solid ${palette.grey[200]}`, // grey.200
          backgroundColor: palette.white,
          ...typography.tagsBold,
          color: palette.grey[600],
          position: 'sticky',
          top: 0,
          zIndex: 1
        },
        body: {
          padding: '16px 24px',
          borderBottom: `1px solid ${palette.grey[200]}`,
          color: palette.grey[900],
          ...typography.smallBodyRegular,
          '&:focus': {
            outline: `2px solid ${palette.brand.main}`,
            outlineOffset: '-2px'
          },

          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 'none'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius.default,
          border: `1px solid ${palette.grey[200]}`,
          boxShadow: 'none'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: shadows[2],
          padding: '8px',
          maxWidth: '50vw',
          '& .MuiList-root': {
            padding: '8px !important'
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius.button,
          minWidth: 100,
          '&.Mui-selected': {
            backgroundColor: `${palette.blueScale[100]}`,
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: `${palette.blueScale[200]}`
            }
          },
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: palette.blueScale[50]
          },
          marginBottom: '4px',
          '&:last-child': {
            marginBottom: 0
          }
        }
      }
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          ...typography.smallBodyRegular
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true
      },
      styleOverrides: {
        root: {
          flex: '1 1 auto'
        }
      },
      variants: [
        {
          props: { variant: 'standard' },
          style: {
            '& .MuiInputBase-root': {
              padding: '9px 0',
              '&:before': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '1px',
                borderBottom: 'none',
                backgroundColor: palette.grey[200]
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '1px',
                borderBottom: 'none',
                backgroundColor: palette.grey[200]
              },
              '&:hover:not(.Mui-disabled):before': {
                height: '2px',
                backgroundColor: palette.grey[600],
                borderBottom: 'none'
              },
              '&.Mui-focused:after': {
                height: '2px',
                backgroundColor: palette.brand.main,
                transform: 'none',
                borderBottom: 'none'
              },
              '&.Mui-error:after': {
                height: '2px',
                backgroundColor: palette.states.error.primary,
                borderBottom: 'none'
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
                '&:before': {
                  height: '1px',
                  borderBottom: 'none',
                  backgroundColor: palette.grey[200]
                }
              },
              '& .MuiInputBase-input': {
                '&::placeholder': {
                  color: palette.grey[400],
                  opacity: 1
                },
                '&.Mui-disabled::placeholder': {
                  color: palette.grey[300]
                }
              }
            },
            '& .MuiFormHelperText-root': {
              marginLeft: '4px',
              ...typography.tagsRegular,
              color: palette.grey[500],
              '&.Mui-error': {
                color: palette.states.error.primary
              },
              '&.Mui-disabled': {
                opacity: 0.5
              }
            },
            '& .MuiInputAdornment-root': {
              '& .MuiTypography-root': {
                color: palette.grey[500],
                cursor: 'inherit'
              },
              '&.Mui-disabled': {
                cursor: 'not-allowed'
              }
            }
          }
        }
      ]
    },
    MuiOutlinedInput: {
      defaultProps: {
        fullWidth: true
      },
      styleOverrides: {
        root: {
          flex: '1 1 auto',
          borderRadius: shape.borderRadius.button,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.brand.main,
            borderWidth: '2px'
          },
          '& .MuiInputBase-input': {
            paddingTop: '10.5px',
            paddingBottom: '10.5px'
          },
          '& .MuiInputBase-inputMultiline': {
            paddingY: '0 !important'
          },
          '& .MuiFormHelperText-root': {
            ...typography.tagsRegular
          }
        }
      }
    },

    MuiAutocomplete: {
      defaultProps: {
        autoSelect: false,
        fullWidth: true,
        slotProps: {
          popper: {
            style: { width: 'fit-content', minWidth: 300, maxWidth: '50vw' },
            placement: 'bottom-start'
          },
          paper: {
            sx: { minWidth: 300 }
          }
        }
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            flex: '1 1 auto',
            paddingTop: '3.25px !important',
            paddingBottom: '3.25px !important',
            transform: 'translateY(-8px) !important',
            '& + .MuiFormHelperText-root': {
              transform: 'translateY(-8px) !important'
            }
          },
          '& .MuiChip-root': {
            '&:hover:not(.Mui-disabled)': {
              cursor: 'revert',
              backgroundColor: palette.brand.light,
              opacity: 1
            },
            backgroundColor: palette.brand.light,
            color: palette.brand.main,
            ...typography.smallBodyRegular,
            borderRadius: shape.borderRadius.button,
            height: '32px',
            margin: '4px',

            '& .MuiChip-deleteIcon': {
              bgcolor: palette.white,
              color: palette.brand.main,
              '&:hover:not(.Mui-disabled)': {
                color: palette.brand.main,
                opacity: 0.8
              }
            },

            '& .MuiChip-label': {
              padding: '8px'
            }
          }
        },
        listbox: {
          padding: '8px !important',
          '& .MuiAutocomplete-option': {
            borderRadius: shape.borderRadius.default,
            minWidth: 100,
            marginBottom: '4px',
            '&:last-child': {
              marginBottom: 0
            },
            '&[aria-selected="true"]': {
              backgroundColor: `${palette.blueScale[100]} !important`,
              '&:hover:not(.Mui-disabled)': {
                backgroundColor: `${palette.blueScale[200]} !important`
              }
            },
            '&:hover': {
              backgroundColor: palette.blueScale[50]
            }
          }
        },
        paper: {
          borderRadius: shape.borderRadius.button,
          boxShadow: shadows[2],
          padding: '8px'
        }
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: palette.grey[400],
          '&.Mui-checked': {
            color: palette.brand.main
          },
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: palette.blueScale[50]
          },
          padding: '9px',
          '&:focus-visible': {
            outline: `2px solid ${palette.brand.main}`,
            outlineOffset: '2px'
          }
        }
      }
    }
  },
  ...shape,
  shadows,
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Figtree', sans-serif"
    },
    h2: {
      fontFamily: "'Figtree', sans-serif"
    },
    h3: {
      fontFamily: "'Figtree', sans-serif"
    },
    h4: {
      fontFamily: "'Figtree', sans-serif"
    },
    h5: {
      fontFamily: "'Figtree', sans-serif"
    },
    h6: {
      fontFamily: "'Figtree', sans-serif"
    },
    ...typography
  },
  palette
})
