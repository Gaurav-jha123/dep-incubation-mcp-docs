import React from "react";
import { Transition } from "@headlessui/react";
import { AlertCircle, RefreshCw, RotateCcw } from "lucide-react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Keep this log for debugging production crashes.
    console.error("UI crash captured by ErrorBoundary", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-100">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#dbeafe_0,_transparent_38%),radial-gradient(circle_at_bottom_right,_#ccfbf1_0,_transparent_42%)]" />

          <Transition
            appear
            show
            as={React.Fragment}
            enter="transition duration-300 ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
          >
            <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
              <div className="w-full max-w-xl rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  An unexpected error occurred while rendering this screen.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={this.handleRetry}
                    className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload page
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
