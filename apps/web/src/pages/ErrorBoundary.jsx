import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowClockwise } from "phosphor-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-4xl">🐞</span>
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Something went wrong</h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground max-w-md mx-auto">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                onClick={() => window.location.reload()}
                size="lg"
                className="font-bold uppercase tracking-wider px-8"
              >
                <ArrowClockwise size={16} className="mr-2 shrink-0" />
                Refresh Page
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
