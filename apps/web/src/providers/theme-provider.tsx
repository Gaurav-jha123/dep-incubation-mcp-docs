import React, { useEffect } from 'react';
import { useThemeStore } from '../lib/theme';
import { initializeTheme, applyTheme } from '../lib/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on first load
    initializeTheme();
  }, []);

  useEffect(() => {
    // Apply theme whenever it changes
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
};
