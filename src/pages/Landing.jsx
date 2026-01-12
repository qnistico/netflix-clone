import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

function Landing() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Auto-login with demo account on first visit
    const autoLoginDemo = async () => {
      const startTime = Date.now();

      try {
        // Check if already logged in
        if (auth.currentUser) {
          // Ensure minimum 1.8 seconds display time
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, 1800 - elapsed);

          await new Promise(resolve => setTimeout(resolve, remainingTime));
          setFadeOut(true);

          // Wait for fade animation to complete
          setTimeout(() => navigate('/home'), 500);
          return;
        }

        // Auto-login with demo account
        await signInWithEmailAndPassword(auth, 'demo@netflix.com', 'demo123456');

        // Ensure minimum 1.8 seconds display time
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 1800 - elapsed);

        await new Promise(resolve => setTimeout(resolve, remainingTime));
        setFadeOut(true);

        // Wait for fade animation to complete
        setTimeout(() => navigate('/home'), 500);
      } catch (err) {
        // If demo login fails, redirect to login page after delay
        console.error('Auto-login failed:', err);
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 1800 - elapsed);

        await new Promise(resolve => setTimeout(resolve, remainingTime));
        setFadeOut(true);
        setTimeout(() => navigate('/login'), 500);
      }
    };

    autoLoginDemo();
  }, [navigate]);

  return (
    <>
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
      <div
        className={`min-h-screen bg-[#141414] flex items-center justify-center transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="text-center">
          <h1 className="text-red-600 text-5xl md:text-6xl font-bold mb-6 animate-[fadeIn_0.6s_ease-out]">
            NETFLIX
          </h1>
          <div className="flex flex-col items-center space-y-3 animate-[fadeIn_0.8s_ease-out]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-400 text-sm">Loading demo experience...</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
