import { useState, useCallback } from 'react';
import './App.css';

// This is the VITE_API_BASE_URL you set in Vercel and your local .env file
const API_URL = import.meta.env.VITE_API_BASE_URL;

type Status = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  // We use useCallback to memoize the function so it's not recreated on every render
  const checkBackend = useCallback(async () => {
    if (!API_URL) {
      setStatus('error');
      setMessage('Error: VITE_API_BASE_URL environment variable is not set.');
      return;
    }

    setStatus('loading');
    setMessage('Connecting to backend...');

    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message); // Should be "Success: Backend is running..."
      } else {
        setStatus('error');
        setMessage(data.message); // Should be "Error: Backend failed..."
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus('error');
      setMessage('Failed to fetch from backend. Check CORS, network, or if the backend is running.');
    }
  }, []); // The dependency array is empty, so this function is created once

  // Helper function to determine button/text color based on status
  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'loading':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-3xl font-bold text-white mb-4">Coffee POS System</h1>
        <p className="text-lg text-gray-300 mb-8">Connection Test</p>
        
        <button
          onClick={checkBackend}
          disabled={status === 'loading'}
          className="test-button"
        >
          {status === 'loading' ? 'Testing...' : 'Test Backend Connection'}
        </button>

        {status !== 'idle' && (
          <div className={`status-message ${getStatusClasses()}`}>
            <p className="font-semibold">Status:</p>
            <p>{message}</p>
          </div>
        )}

        {!API_URL && (
           <div className="status-message text-red-500">
             <p className="font-semibold">Configuration Error:</p>
             <p>VITE_API_BASE_URL is not defined. Please check your .env file or Vercel environment variables.</p>
           </div>
        )}
      </header>
    </div>
  );
}

export default App;
