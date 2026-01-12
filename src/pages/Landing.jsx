import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-login with demo account on first visit
    const autoLoginDemo = async () => {
      try {
        // Check if already logged in
        if (auth.currentUser) {
          navigate('/home');
          return;
        }

        // Auto-login with demo account
        await signInWithEmailAndPassword(auth, 'demo@netflix.com', 'demo123456');
        navigate('/home');
      } catch (err) {
        // If demo login fails, redirect to login page
        console.error('Auto-login failed:', err);
        navigate('/login');
      }
    };

    autoLoginDemo();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-red-600 text-5xl font-bold mb-4">NETFLIX</h1>
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-gray-400 text-sm">Loading demo experience...</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
