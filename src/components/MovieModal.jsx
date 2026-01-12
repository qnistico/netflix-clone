import { useState, useEffect } from 'react';
import tmdb from '../services/tmdb';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function MovieModal({ movieId, mediaType, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await tmdb.getDetails(mediaType, movieId);
        setDetails(data);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchDetails();
    }
  }, [movieId, mediaType]);

  // Check if movie is in user's list or liked
  useEffect(() => {
    const checkUserData = async () => {
      if (!auth.currentUser || !movieId) return;

      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const movieKey = `${mediaType}_${movieId}`;
          setInMyList(userData.myList?.includes(movieKey) || false);
          setIsLiked(userData.liked?.includes(movieKey) || false);
        }
      } catch (err) {
        console.error('Error checking user data:', err);
      }
    };

    checkUserData();
  }, [movieId, mediaType]);

  if (!movieId) return null;

  // Handler for adding/removing from list
  const handleToggleList = async () => {
    if (!auth.currentUser) {
      alert('Please sign in to add to your list');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const movieKey = `${mediaType}_${movieId}`;

      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          myList: [movieKey],
          liked: []
        });
        setInMyList(true);
      } else {
        // Update existing document
        if (inMyList) {
          await updateDoc(userDocRef, {
            myList: arrayRemove(movieKey)
          });
          setInMyList(false);
        } else {
          await updateDoc(userDocRef, {
            myList: arrayUnion(movieKey)
          });
          setInMyList(true);
        }
      }
    } catch (err) {
      console.error('Error updating list:', err);
      alert('Failed to update list');
    }
  };

  // Handler for liking/unliking
  const handleToggleLike = async () => {
    if (!auth.currentUser) {
      alert('Please sign in to like');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const movieKey = `${mediaType}_${movieId}`;

      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          myList: [],
          liked: [movieKey]
        });
        setIsLiked(true);
      } else {
        // Update existing document
        if (isLiked) {
          await updateDoc(userDocRef, {
            liked: arrayRemove(movieKey)
          });
          setIsLiked(false);
        } else {
          await updateDoc(userDocRef, {
            liked: arrayUnion(movieKey)
          });
          setIsLiked(true);
        }
      }
    } catch (err) {
      console.error('Error updating like:', err);
      alert('Failed to update like');
    }
  };

  // Get trailer
  const trailer = details?.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '1rem',
          overflowY: 'auto',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'relative',
            backgroundColor: '#181818',
            borderRadius: '0.5rem',
            width: '100%',
            maxWidth: '56rem',
            margin: '2rem 0',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'scaleIn 0.25s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#181818] hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : details ? (
          <>
            {/* Hero/Trailer Section */}
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              {trailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem'
                  }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${tmdb.getImageUrl(details.backdrop_path)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #181818, transparent)'
                  }}></div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-8">
              {/* Title (shows for all) */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                {details.title || details.name}
              </h2>
              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 mb-6">
                <button
                  onClick={handleToggleList}
                  className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                    inMyList
                      ? 'bg-white border-white text-black'
                      : 'border-gray-400 hover:border-white hover:bg-white/10'
                  }`}
                  title={inMyList ? 'Remove from My List' : 'Add to My List'}
                >
                  {inMyList ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={handleToggleLike}
                  className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                    isLiked
                      ? 'bg-white border-white text-black'
                      : 'border-gray-400 hover:border-white hover:bg-white/10'
                  }`}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-8">
                {/* Left Column - Main Info */}
                <div className="md:col-span-2 flex flex-col gap-3 md:gap-4">
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                    <span className="text-green-500 font-semibold">
                      {Math.round(details.vote_average * 10)}% Match
                    </span>
                    <span className="text-gray-400">
                      {details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0]}
                    </span>
                    {details.runtime && (
                      <span className="text-gray-400">{details.runtime} min</span>
                    )}
                    {details.number_of_seasons && (
                      <span className="text-gray-400">{details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</span>
                    )}
                  </div>

                  {/* Overview */}
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    {details.overview}
                  </p>
                </div>

                {/* Right Column - Cast & Genres */}
                <div className="flex flex-col gap-3 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-400">Genres: </span>
                    <span className="text-white">
                      {details.genres?.map(g => g.name).join(', ')}
                    </span>
                  </div>

                  {details.credits?.cast?.length > 0 && (
                    <div>
                      <span className="text-gray-400">Cast: </span>
                      <span className="text-white">
                        {details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {details.production_companies?.length > 0 && (
                    <div>
                      <span className="text-gray-400">Studio: </span>
                      <span className="text-white">
                        {details.production_companies[0].name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
    </>
  );
}

export default MovieModal;