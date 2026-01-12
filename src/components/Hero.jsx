import { useState, useEffect } from 'react';
import tmdb from '../services/tmdb';

function Hero({ onMovieClick, mediaType = 'movie' }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      const data = await tmdb.getTrending(mediaType, 'week');
      // Get a random trending movie/show for the hero
      const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
      setMovie(randomMovie);
    };

    fetchHeroMovie();
  }, [mediaType]);

  if (!movie) return null;

  // Truncate description
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <div 
      className="relative h-[80vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(${tmdb.getImageUrl(movie.backdrop_path)})`,
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-2xl space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          {movie.title || movie.name}
        </h1>
        
        <p className="text-sm md:text-lg text-gray-300 leading-relaxed">
          {truncate(movie.overview, 150)}
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => onMovieClick && onMovieClick(movie)}
            className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded hover:bg-white/80 transition-all duration-200 font-semibold hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <span>Play</span>
          </button>

          <button
            onClick={() => onMovieClick && onMovieClick(movie)}
            className="flex items-center space-x-2 bg-gray-500/70 text-white px-6 py-2 rounded hover:bg-gray-500/50 transition-all duration-200 font-semibold hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>More Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;