import { createTheme, ThemeProvider } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { LANGUAGE } from '../global';
import { enUS, esES, jaJP, zhCN } from '@mui/material/locale';

const getMUILang = () => {
  switch (LANGUAGE) {
    case 'en': {
      return enUS;
    }
    case 'zh': {
      return zhCN;
    }
    case 'es': {
      return esES;
    }
    case 'ja':
    default: {
      return jaJP;
    }
  }
};

export const getMUITheme = () => {
  return createTheme(
    {
      palette: {
        primary: {
          main: '#3498db',
        },
      },
    },
    getMUILang()
  );
};

export const MUIThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={getMUITheme()}>{children}</ThemeProvider>
);
