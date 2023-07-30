/* eslint-disable max-len */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: ['Inter'],
    button: {
      textTransform: "none"
    }
  },
  
  palette: {
    mode: 'dark',
    primary: {
      main: '#DE179E',
      dark: '#F4B45B'
    },
    secondary: {
      main: '#06D1F8',
      dark: '#ba000d'
    },
  },
});

export default theme;

