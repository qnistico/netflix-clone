import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Failed to create account');
      }
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

        {/* Signup Form */}
        <div className="bg-black/70 p-8 rounded-lg">
          <h1 className="text-3xl font-semibold mb-6">Sign Up</h1>
          
          {error && (
            <div className="bg-orange-500 text-white px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            
            <input 
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              required
              minLength={6}
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Demo Account Alternative */}
          <div className="mt-4 p-4 bg-gray-800/50 rounded border border-gray-700">
            <p className="text-sm text-gray-300 mb-2">Want to explore first?</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded font-semibold transition text-sm"
            >
              Try Demo Account Instead
            </button>
          </div>

          <div className="mt-6 text-gray-400 text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline">
                Sign in now
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;