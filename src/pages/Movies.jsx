import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import Footer from '../components/Footer';
import ContentFilters from '../components/ContentFilters';
import tmdb from '../services/tmdb';

// TMDB Movie Genre IDs
const MOVIE_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCI_FI: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
};

function Movies() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filters, setFilters] = useState({ genre: 'all', year: 'all' });

  const handleMovieClick = (movie) => {
    setSelectedMovie({
      id: movie.id,
      mediaType: 'movie'
    });
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const hasFilters = filters.genre !== 'all' || filters.year !== 'all';

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <Hero onMovieClick={handleMovieClick} />

      <div className="relative -mt-32 z-10">
        <ContentFilters
          onFilterChange={handleFilterChange}
          genres={MOVIE_GENRES}
          type="movie"
        />

        {hasFilters && (
          <MovieRow
            title="Filtered Results"
            fetchUrl={() => tmdb.getFilteredMovies(filters)}
            onMovieClick={handleMovieClick}
            key={`${filters.genre}-${filters.year}`}
          />
        )}
        <MovieRow
          title="Popular Movies"
          fetchUrl={tmdb.getPopularMovies}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Top Rated Movies"
          fetchUrl={tmdb.getTopRatedMovies}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Trending Movies"
          fetchUrl={() => tmdb.getTrending('movie', 'week')}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Action Movies"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.ACTION)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Comedies"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.COMEDY)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Horror Movies"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.HORROR)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Romance Movies"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.ROMANCE)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Sci-Fi Movies"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.SCI_FI)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Thrillers"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.THRILLER)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Documentaries"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.DOCUMENTARY)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Animated Movies"
          fetchUrl={() => tmdb.getMoviesByGenre(MOVIE_GENRES.ANIMATION)}
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

export default Movies;
