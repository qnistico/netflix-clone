import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <a href="#" className="hover:text-gray-300 transition">Home</a>
            <a href="#" className="hover:text-gray-300 transition">TV Shows</a>
            <a href="#" className="hover:text-gray-300 transition">Movies</a>
            <a href="#" className="hover:text-gray-300 transition">New & Popular</a>
            <a href="#" className="hover:text-gray-300 transition">My List</a>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-gray-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <Link to="/login" className="text-sm hover:text-gray-300 transition">
            Sign In
          </Link>

          {/* Avatar - will be used when logged in */}
          <div className="w-8 h-8 rounded bg-red-600"></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;