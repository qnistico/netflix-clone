import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdb from '../services/tmdb';
import Navbar from '../components/Navbar';
import MovieModal from '../components/MovieModal';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query || query.trim() === '') {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const data = await tmdb.search(query);
        // Filter out results without poster images and only keep movie/tv types
        const filtered = data.results.filter(
          item => item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv')
        );
        setResults(filtered);
      } catch (err) {
        console.error('Error searching:', err);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 pb-12">
        {query && (
          <h1 className="text-2xl md:text-3xl font-semibold mb-8">
            Search results for "{query}"
          </h1>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : !query || query.trim() === '' ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Enter a search term to find movies and TV shows</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No results found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try searching for something else</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((item) => (
              <div
                key={`${item.media_type}_${item.id}`}
                className="cursor-pointer group"
                onClick={() => setSelectedMovie({ id: item.id, mediaType: item.media_type })}
              >
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={tmdb.getImageUrl(item.poster_path, 'w500')}
                    alt={item.title || item.name}
                    className="w-full transition-transform group-hover:scale-110"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      
                    </div>
                  </div>
                </div>

                {/* Title and info */}
                <div className="mt-2">
                  <h3 className="text-sm font-medium truncate">
                    {item.title || item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span className="capitalize">{item.media_type}</span>
                    {item.vote_average > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-green-500">
                          {Math.round(item.vote_average * 10)}% Match
                        </span>
                      </>
                    )}
                    {(item.release_date || item.first_air_date) && (
                      <>
                        <span>•</span>
                        <span>
                          {(item.release_date || item.first_air_date).split('-')[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movieId={selectedMovie.id}
          mediaType={selectedMovie.mediaType}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default Search;
