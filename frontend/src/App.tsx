import { useState } from 'react'
import connection from './api/client'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      const data = await connection.getHealth();
      setHealthStatus(`Service is healthy: ${JSON.stringify(data)}`);
    } catch (error) {
      setHealthStatus(`Service is unhealthy: ${error}`);
    }
  };

  return (
    <div>
      <h1>Backend Health Status</h1>
      <button onClick={checkHealth}>
        Check Health
      </button>
      <p>{healthStatus}</p>
    </div>
  )
}

export default App
