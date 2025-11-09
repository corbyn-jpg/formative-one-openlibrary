import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI with retry option
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          padding: '20px',
          backgroundColor: 'rgba(81, 53, 44, 0.8)',
          borderRadius: '8px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: '10px' }}>
            Oops! Something went wrong
          </h2>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>
            {this.props.errorMessage || 'This component encountered an error. Please try again.'}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4bc089',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'serif'
            }}
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', fontSize: '12px' }}>
              <summary>Error Details</summary>
              <pre style={{ 
                textAlign: 'left', 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                padding: '10px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;