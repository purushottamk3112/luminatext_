import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              We're sorry, but something unexpected happened. Don't worry, it's not your fault!
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-gray-500 bg-gray-900 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 w-full px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}