import React from 'react';

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.log("Error caught in ErrorBoundary:", error, errorInfo);

  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI if an error is caught
      return (    <main className="grid min-h-full place-items-center bg-red px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-purple-600 text-8xl">🐞</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Oops! Something went wrong.</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
          Refresh the page and try again
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">  {/* <a href="#" className="text-sm font-semibold text-gray-900">Contact support <span aria-hidden="true">&rarr;</span></a> */}
          </div>
        </div>
      </main>)
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
