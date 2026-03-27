import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../lib/theme';
import { Button } from '../atoms/Button/Button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-border hover:bg-accent transition-colors"
      aria-label="Toggle theme"
      variant= 'secondary'
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};
