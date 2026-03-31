import { Dialog } from "@headlessui/react";

type LoaderProps = {
  open: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'blue';
};

export default function Loader({ open, size = 'medium'}: LoaderProps) {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4',
  };

  // Use palette primary color variable for border
  const borderColor = 'var(--color-primary-500)';

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50" aria-label="Loading">
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
        <div
          data-testid="loader-spinner"
          className={`${sizeClasses[size]} border-t-transparent rounded-full animate-spin`}
          style={{ borderColor, borderTopColor: 'transparent' }}
        ></div>
      </div>
    </Dialog>
  );
}