import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'light',
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

export default theme;
