import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import Footer from '../components/Footer';
import tmdb from '../services/tmdb';

function NewAndPopular() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie({
      id: movie.id,
      mediaType: movie.media_type || (movie.title ? 'movie' : 'tv')
    });
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <Hero onMovieClick={handleMovieClick} />

      <div className="relative -mt-32 z-10">
        <MovieRow
          title="Trending This Week"
          fetchUrl={() => tmdb.getTrending('all', 'week')}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Trending Today"
          fetchUrl={() => tmdb.getTrending('all', 'day')}
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
        <MovieRow
          title="Top Rated Movies"
          fetchUrl={tmdb.getTopRatedMovies}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Top Rated TV Shows"
          fetchUrl={tmdb.getTopRatedTVShows}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Trending Movies"
          fetchUrl={() => tmdb.getTrending('movie', 'week')}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Trending TV Shows"
          fetchUrl={() => tmdb.getTrending('tv', 'week')}
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

      <Footer />
    </div>
  );
}

export default NewAndPopular;
