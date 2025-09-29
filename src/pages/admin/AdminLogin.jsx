import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      const token = res.data?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        navigate('/admin', { replace: true });
      } else {
        setError('Noto\'g\'ri javob');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kirish muvaffaqiyatsiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
        <label className="block mb-2 text-sm font-medium">Login</label>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" placeholder="admin" />
        <label className="block mb-2 text-sm font-medium">Parol</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" placeholder="admin" />
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-700 text-white rounded py-2 font-semibold disabled:opacity-60">
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;


