import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import Footer from '../components/Footer';
import ContentFilters from '../components/ContentFilters';
import tmdb from '../services/tmdb';

// TMDB TV Genre IDs
const TV_GENRES = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37
};

function TVShows() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filters, setFilters] = useState({ genre: 'all', year: 'all' });

  const handleMovieClick = (movie) => {
    setSelectedMovie({
      id: movie.id,
      mediaType: 'tv'
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
      <Hero onMovieClick={handleMovieClick} mediaType="tv" />

      <div className="relative -mt-32 z-10">
        <ContentFilters
          onFilterChange={handleFilterChange}
          genres={TV_GENRES}
          type="tv"
        />

        {hasFilters && (
          <MovieRow
            title="Filtered Results"
            fetchUrl={() => tmdb.getFilteredTVShows(filters)}
            onMovieClick={handleMovieClick}
            key={`${filters.genre}-${filters.year}`}
          />
        )}
        <MovieRow
          title="Popular TV Shows"
          fetchUrl={tmdb.getPopularTVShows}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Top Rated TV Shows"
          fetchUrl={tmdb.getTopRatedTVShows}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Trending TV Shows"
          fetchUrl={() => tmdb.getTrending('tv', 'week')}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="TV Dramas"
          fetchUrl={() => tmdb.getTVShowsByGenre(TV_GENRES.DRAMA)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="TV Comedies"
          fetchUrl={() => tmdb.getTVShowsByGenre(TV_GENRES.COMEDY)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Action & Adventure"
          fetchUrl={() => tmdb.getTVShowsByGenre(TV_GENRES.ACTION_ADVENTURE)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Sci-Fi & Fantasy"
          fetchUrl={() => tmdb.getTVShowsByGenre(TV_GENRES.SCI_FI_FANTASY)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Crime Shows"
          fetchUrl={() => tmdb.getTVShowsByGenre(TV_GENRES.CRIME)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Mystery Shows"
          fetchUrl={() => tmdb.getTVShowsByGenre(TV_GENRES.MYSTERY)}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Documentaries"
          fetchUrl={() => tmdb.getTVShowsByGenre(TV_GENRES.DOCUMENTARY)}
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

export default TVShows;
