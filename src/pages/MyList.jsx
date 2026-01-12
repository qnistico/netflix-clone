import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import tmdb from '../services/tmdb';
import Navbar from '../components/Navbar';
import MovieModal from '../components/MovieModal';

function MyList() {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyList = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const listItems = userData.myList || [];

          // Fetch details for each movie/show
          const detailsPromises = listItems.map(async (item) => {
            const [mediaType, id] = item.split('_');
            try {
              const details = await tmdb.getDetails(mediaType, id);
              return { ...details, mediaType, id };
            } catch (err) {
              console.error(`Error fetching details for ${item}:`, err);
              return null;
            }
          });

          const details = await Promise.all(detailsPromises);
          setMyList(details.filter(item => item !== null));
        }
      } catch (err) {
        console.error('Error fetching my list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
  }, [navigate]);

  const handleRemove = async (mediaType, id) => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const movieKey = `${mediaType}_${id}`;

      await updateDoc(userDocRef, {
        myList: arrayRemove(movieKey)
      });

      // Update local state
      setMyList(myList.filter(item => !(item.mediaType === mediaType && item.id === id)));
    } catch (err) {
      console.error('Error removing from list:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">My List</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : myList.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">Your list is empty</p>
            <p className="text-gray-500">Add titles you want to watch by clicking the + button</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {myList.map((item) => (
              <div
                key={`${item.mediaType}_${item.id}`}
                className="relative group cursor-pointer"
              >
                <img
                  src={tmdb.getImageUrl(item.poster_path, 'w500')}
                  alt={item.title || item.name}
                  className="w-full rounded-md transition-transform group-hover:scale-105"
                  onClick={() => setSelectedMovie({ id: item.id, mediaType: item.mediaType })}
                />

                {/* Overlay on hover */}
                <div
  className="
    absolute inset-0
    bg-opacity-0 group-hover:bg-opacity-60
    transition-all rounded-md
    flex items-center justify-center
    opacity-0 group-hover:opacity-100
    pointer-events-none
    mylist-item-hoverstate
  "
>


                 <button
  onClick={(e) => {
    e.stopPropagation();
    handleRemove(item.mediaType, item.id);
  }}
  className="
    pointer-events-auto
    bg-red-600 hover:bg-red-700
    text-white px-4 py-2
    rounded-md font-semibold transition
  "
>
  Remove
</button>

                </div>

                {/* Title below poster */}
                <h3 className="mt-2 text-sm font-medium truncate">
                  {item.title || item.name}
                </h3>
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

export default MyList;
