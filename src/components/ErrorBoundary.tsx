import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  silent?: boolean;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.silent) {
        return null;
      }
      return this.props.fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4 bg-neutral-900/50 rounded-[32px] border border-white/5">
          <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Something went wrong</h2>
          <p className="text-white/50 max-w-xs mx-auto">
            We encountered an error while loading this section. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm font-bold transition-colors border border-white/10"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
