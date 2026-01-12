import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, 'demo@netflix.com', 'demo123456');
      navigate('/');
    } catch (err) {
      setError('Demo account not available');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="text-red-600 text-3xl font-bold mb-8 block">
          NETFLIX
        </Link>

        {/* Login Form */}
        <div className="bg-black/70 p-8 rounded-lg">
          <h1 className="text-3xl font-semibold mb-6">Sign In</h1>
          
          {error && (
            <div className="bg-orange-500 text-white px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Account Button */}
          <div className="mt-4">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded font-semibold transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Try Demo Account</span>
            </button>
            <p className="text-gray-400 text-xs text-center mt-2">
              Skip registration - explore with one click
            </p>
          </div>

          <div className="mt-6 text-gray-400 text-sm">
            <p>
              New to Netflix?{' '}
              <Link to="/signup" className="text-white hover:underline">
                Sign up now
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;