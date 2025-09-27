import { useState, useEffect } from 'react';
import axios from 'axios';

const ApiStatus = () => {
  const [status, setStatus] = useState({ loading: true, connected: false, error: null });

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await axios.get('/api/health', { timeout: 10000 });
        setStatus({ loading: false, connected: true, error: null, data: response.data });
      } catch (error) {
        setStatus({ 
          loading: false, 
          connected: false, 
          error: error.response?.data?.message || error.message 
        });
      }
    };

    checkApiConnection();
    // Check every 30 seconds
    const interval = setInterval(checkApiConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status.loading) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        🔄 API ulanishini tekshirilmoqda...
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        ❌ API bilan ulanishda xatolik: {status.error}
      </div>
    );
  }
};

export default ApiStatus;