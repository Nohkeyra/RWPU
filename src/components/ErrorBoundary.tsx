import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.hash = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] p-6 sm:p-10 bg-[#141417] rounded-2xl border border-red-500/20 text-center space-y-6 max-w-2xl mx-auto my-8 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-display font-bold text-[#F4F4F6]">
              {this.props.fallbackTitle || 'A Rendering Error Occurred'}
            </h2>
            <p className="text-sm text-[#8E8E93] max-w-md mx-auto">
              Our diagnostic engine caught an unexpected interface exception. You can reload the page or return to the main dashboard.
            </p>
          </div>

          {this.state.error && (
            <div className="bg-[#0B0B0C] border border-[#222226] rounded-xl p-4 text-left max-h-[180px] overflow-y-auto font-mono text-xs text-red-400 space-y-2">
              <p className="font-bold border-b border-[#222226] pb-1.5 text-[10px] text-[#8E8E93] uppercase tracking-wider">
                Error Details:
              </p>
              <p className="font-semibold break-words">{this.state.error.toString()}</p>
              {this.state.error.stack && (
                <pre className="text-[10px] text-[#8E8E93] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {this.state.error.stack.split('\n').slice(0, 4).join('\n')}
                </pre>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={this.handleReset}
              className="h-10 px-4 bg-red-500 hover:bg-red-600 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Page
            </Button>
            <Button
              onClick={this.handleGoHome}
              variant="outline"
              className="h-10 px-4 border-[#222226] bg-[#141417] hover:bg-[#222226] text-[#F4F4F6] hover:text-[#F4F4F6] font-medium text-xs rounded-lg transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Back Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
