import { useState, useEffect } from 'react';
import tmdb from '../services/tmdb';

function MovieModal({ movieId, mediaType, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (!movieId) return null;

  // Get trailer
  const trailer = details?.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return (
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
        overflowY: 'auto'
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#181818] hover:bg-gray-700 rounded-full flex items-center justify-center transition"
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
                  {/* Title only shows when no trailer */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2rem',
                    background: 'linear-gradient(to top, #181818, transparent)'
                  }}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {details.title || details.name}
                    </h2>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Title (shows for all) */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {details.title || details.name}
              </h2>
              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded hover:bg-white/80 transition font-semibold">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span>Play</span>
                </button>

                <button className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                <button className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </button>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm">
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
                  <p className="text-gray-300 leading-relaxed">
                    {details.overview}
                  </p>
                </div>

                {/* Right Column - Cast & Genres */}
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Genres: </span>
                    <span className="text-white">
                      {details.genres?.map(g => g.name).join(', ')}
                    </span>
                  </div>

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
  );
}

export default MovieModal;