import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import tmdb from '../services/tmdb';

function ContinueWatchingRow({ onMovieClick }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const rowRef = useRef(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Real-time listener for watch progress
    const watchProgressRef = collection(db, 'users', user.uid, 'watchProgress');
    const q = query(watchProgressRef, orderBy('lastWatched', 'desc'), limit(15));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const watchData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter out completed items (>95% watched)
        const inProgress = watchData.filter(item => item.progress < 95);

        // Fetch movie/show details
        const detailsPromises = inProgress.map(async (item) => {
          try {
            const details = await tmdb.getDetails(item.mediaType, item.movieId);

            // Check if item has a trailer video
            const hasTrailer = details?.videos?.results?.some(
              v => v.type === 'Trailer' && v.site === 'YouTube'
            );

            // Only include if it has a trailer
            if (!hasTrailer) return null;

            return {
              ...details,
              mediaType: item.mediaType,
              progress: item.progress,
              lastWatched: item.lastWatched
            };
          } catch (err) {
            console.error('Error fetching details:', err);
            return null;
          }
        });

        const details = await Promise.all(detailsPromises);
        setItems(details.filter(item => item !== null));
      } catch (err) {
        console.error('Error loading continue watching:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="px-4 md:px-12 my-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Continue Watching</h2>

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

        {/* Items container */}
        <div
          ref={rowRef}
          className="flex space-x-2 overflow-x-scroll scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onMovieClick({ id: item.id, media_type: item.mediaType, shouldResume: true })}
              className="min-w-[200px] md:min-w-[280px] cursor-pointer transform hover:scale-105 transition-transform duration-300 relative"
            >
              <div className="relative">
                <img
                  src={tmdb.getImageUrl(item.backdrop_path || item.poster_path, 'w500')}
                  alt={item.title || item.name}
                  className="rounded-lg w-full h-[120px] md:h-[160px] object-cover"
                />
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium truncate">{item.title || item.name}</h3>
              </div>
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

export default ContinueWatchingRow;
