import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/home" className="text-red-600 text-2xl md:text-3xl font-bold">
            NETFLIX
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6 text-sm">
            <Link to="/home" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 inline-block">Home</Link>
            <Link to="/tv-shows" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 inline-block">TV Shows</Link>
            <Link to="/movies" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 inline-block">Movies</Link>
            <Link to="/new-and-popular" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 inline-block">New & Popular</Link>
            {user && <Link to="/my-list" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 inline-block">My List</Link>}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center animate-[slideIn_0.2s_ease-out]">
                <style>{`
                  @keyframes slideIn {
                    from {
                      opacity: 0;
                      transform: translateX(20px);
                    }
                    to {
                      opacity: 1;
                      transform: translateX(0);
                    }
                  }
                `}</style>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="bg-black/70 border border-white text-white px-4 py-1 rounded-md focus:outline-none focus:border-red-600 w-48 md:w-64 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="ml-2 hover:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <svg className="cursor-pointer w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="hover:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
          
          {user ? (
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-semibold cursor-pointer">
                  {user.email?.[0].toUpperCase()}
                </div>
              </button>

              {showDropdown && (
                <>
                  <style>{`
                    @keyframes dropdownSlideIn {
                      from {
                        opacity: 0;
                        transform: translateY(-10px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-700 rounded shadow-lg animate-[dropdownSlideIn_0.2s_ease-out]">
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-sm truncate">{user.email}</p>
                      {user.email === 'demo@netflix.com' && (
                        <span className="text-xs text-yellow-400">Demo Account</span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-gray-800 text-sm transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm hover:text-gray-300 transition-all duration-200 bg-red-600 hover:bg-red-700 px-4 py-2 rounded hover:scale-105">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;