import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Get current watch progress
export const getWatchProgress = async (movieId, mediaType) => {
  if (!auth.currentUser) return 0;

  try {
    const progressRef = doc(
      db,
      'users',
      auth.currentUser.uid,
      'watchProgress',
      `${mediaType}_${movieId}`
    );
    const progressDoc = await getDoc(progressRef);
    return progressDoc.exists() ? progressDoc.data().progress : 0;
  } catch (err) {
    console.error('Error getting watch progress:', err);
    return 0;
  }
};

// Track watch progress
export const trackWatchProgress = async (movieId, mediaType, progressPercent) => {
  if (!auth.currentUser) return;

  try {
    const progressRef = doc(
      db,
      'users',
      auth.currentUser.uid,
      'watchProgress',
      `${mediaType}_${movieId}`
    );

    await setDoc(progressRef, {
      movieId: String(movieId),
      mediaType,
      progress: Math.min(100, Math.max(0, progressPercent)),
      lastWatched: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Error tracking watch progress:', err);
  }
};

// Simulate watching (for demo purposes)
// In a real app, this would track actual video playback
export const simulateWatching = async (movieId, mediaType, shouldResume = false) => {
  if (!auth.currentUser) return null;

  // Get existing progress - only resume if shouldResume is true
  const startingProgress = shouldResume ? await getWatchProgress(movieId, mediaType) : 0;

  // Create a unique progress tracker for this specific movie
  const progressTracker = {
    current: startingProgress,
    movieId: String(movieId),
    mediaType: mediaType
  };

  // Simulate progress: increase every 2 seconds
  const interval = setInterval(() => {
    progressTracker.current += 10; // Increase by 10% every 2 seconds

    // Track the progress for THIS specific movie
    trackWatchProgress(
      progressTracker.movieId,
      progressTracker.mediaType,
      progressTracker.current
    );

    // Stop at 80% (simulate user stopping before end)
    if (progressTracker.current >= 80) {
      clearInterval(interval);
    }
  }, 2000);

  return interval;
};
