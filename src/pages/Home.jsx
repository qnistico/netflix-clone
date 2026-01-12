import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import tmdb from '../services/tmdb';

function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);

const handleMovieClick = (movie) => {
  console.log('Movie clicked:', movie); // ADD THIS LINE
  setSelectedMovie({
    id: movie.id,
    mediaType: movie.media_type || (movie.title ? 'movie' : 'tv')
  });
};

  const closeModal = () => {
    setSelectedMovie(null);
  };
  console.log('Current selectedMovie state:', selectedMovie); // ADD THIS

  return (
    
     <div className="min-h-screen bg-[#141414]">
    <div className="bg-red-500 text-white p-4">TAILWIND TEST</div> {/* ADD THIS */}
    <Navbar />
    <Hero />
      
      <div className="relative -mt-32 z-10">
        <MovieRow 
          title="Trending Now" 
          fetchUrl={() => tmdb.getTrending('all', 'week')}
          onMovieClick={handleMovieClick}
        />
        <MovieRow 
          title="Popular Movies" 
          fetchUrl={tmdb.getPopularMovies}
          onMovieClick={handleMovieClick}
        />
        <MovieRow 
          title="Popular TV Shows" 
          fetchUrl={tmdb.getPopularTVShows}
          onMovieClick={handleMovieClick}
        />
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal 
          movieId={selectedMovie.id}
          mediaType={selectedMovie.mediaType}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Home;