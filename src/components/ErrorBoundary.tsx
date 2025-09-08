import React from 'react';
import { Card } from './shared/Card';
import { Button } from './shared/Button';

interface Props {
  children: React.ReactNode;
  resetKey?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const Fallback: React.FC<{
  error: Error | null;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ 
  error, 
  title = "Errore Critico",
  message = "Si è verificato un errore imprevisto che impedisce il corretto funzionamento dell'applicazione.",
  actionText = "Ricarica la pagina",
  onAction = () => window.location.reload()
}) => (
  <div className="flex h-full min-h-[400px] items-center justify-center p-4 bg-[#fcf8f8]">
    <Card title={title} className="max-w-lg w-full border-l-4 border-red-500">
      <p className="text-[#1b0e0e] mb-4">{message}</p>
      {error && (
        <details className="bg-[#f3e7e8] p-2 rounded text-sm text-[#c02128] overflow-auto mb-4 cursor-pointer">
          <summary className="font-medium">Dettagli tecnici</summary>
          <pre className="mt-2 text-xs whitespace-pre-wrap">
            {error.toString()}
          </pre>
        </details>
      )}
      <Button onClick={onAction} variant="primary">
        {actionText}
      </Button>
    </Card>
  </div>
);

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error !== null && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.resetKey) {
        return (
          <Fallback 
            error={this.state.error} 
            onAction={this.handleRetry} 
            actionText="Riprova"
            title="Errore nel componente"
            message="Si è verificato un errore durante il rendering di questa sezione."
          />
        );
      }
      return (
        <div className="h-screen w-screen">
          <Fallback error={this.state.error} />
        </div>
      );
    }

    return this.props.children;
  }
}