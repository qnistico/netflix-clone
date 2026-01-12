import { useState, useEffect, useRef } from 'react';
import tmdb from '../services/tmdb';

function MovieRow({ title, fetchUrl, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await fetchUrl();
      setMovies(data.results);
    };

    fetchMovies();
  }, [fetchUrl]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 md:px-12 my-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="relative group">
        {/* Left arrow */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Movies container */}
        <div 
          ref={rowRef}
          className="flex space-x-2 overflow-x-scroll scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="min-w-[200px] md:min-w-[280px] cursor-pointer transform hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={tmdb.getImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
                alt={movie.title || movie.name}
                className="rounded-lg w-full h-[120px] md:h-[160px] object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MovieRow;