import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-red-600 text-2xl md:text-3xl font-bold">
            NETFLIX
          </Link>
          
          {/* Nav Links */}
          <div className="hidden md:flex space-x-6 text-sm">
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
            <a href="#" className="hover:text-gray-300 transition">TV Shows</a>
            <a href="#" className="hover:text-gray-300 transition">Movies</a>
            <a href="#" className="hover:text-gray-300 transition">New & Popular</a>
            {user && <a href="#" className="hover:text-gray-300 transition">My List</a>}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-gray-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-semibold">
                  {user.email?.[0].toUpperCase()}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-700 rounded shadow-lg">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm truncate">{user.email}</p>
                    {user.email === 'demo@netflix.com' && (
                      <span className="text-xs text-yellow-400">Demo Account</span>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-sm transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm hover:text-gray-300 transition bg-red-600 px-4 py-2 rounded">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;