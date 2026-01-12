import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdb from '../services/tmdb';
import Navbar from '../components/Navbar';
import MovieModal from '../components/MovieModal';
import SkeletonCard from '../components/SkeletonCard';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query || query.trim() === '') {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setAnimateItems(false);
        const data = await tmdb.search(query);
        // Filter out results without poster images and only keep movie/tv types
        const filtered = data.results.filter(
          item => item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv')
        );
        setResults(filtered);
        // Trigger stagger animation
        setTimeout(() => setAnimateItems(true), 50);
      } catch (err) {
        console.error('Error searching:', err);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .stagger-item {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <div className="min-h-screen bg-[#141414]">
        <Navbar />

      <div className="pt-24 px-4 md:px-8 lg:px-12 pb-12">
        {query && (
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 md:mb-8">
            Search results for "{query}"
          </h1>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {results.map((item, index) => (
              <div
                key={`${item.media_type}_${item.id}`}
                className={`cursor-pointer group ${animateItems ? 'stagger-item' : ''}`}
                style={animateItems ? { animationDelay: `${index * 0.05}s` } : {}}
                onClick={() => setSelectedMovie({ id: item.id, mediaType: item.media_type })}
              >
                <div className="relative overflow-hidden rounded-md transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/50 group-hover:-translate-y-2">
                  <img
                    src={tmdb.getImageUrl(item.poster_path, 'w500')}
                    alt={item.title || item.name}
                    className="w-full transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
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
    </>
  );
}

export default Search;
