import { ThemeProvider } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { getMUITheme } from '../i18n';

export const MUIThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={getMUITheme()}>{children}</ThemeProvider>
);
