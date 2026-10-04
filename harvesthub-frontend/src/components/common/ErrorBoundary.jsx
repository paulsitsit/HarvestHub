import { Component } from 'react';
import Button from './Button.jsx';
import GlassCard from './GlassCard.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      'HarvestHub frontend error:',
      error,
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-5 py-12">
          <GlassCard className="w-full max-w-lg p-8 text-center">
            <p
              className="text-5xl"
              aria-hidden="true"
            >
              🌱
            </p>

            <h1 className="mt-5 text-2xl font-extrabold text-[var(--green-900)]">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Please reload the page and try again.
            </p>

            <Button
              type="button"
              onClick={this.handleReload}
              className="mt-6"
            >
              Reload application
            </Button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;