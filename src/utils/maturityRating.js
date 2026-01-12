// Get maturity rating based on TMDB data
export const getMaturityRating = (details) => {
  // For movies
  if (details.release_dates?.results) {
    const usRelease = details.release_dates.results.find(r => r.iso_3166_1 === 'US');
    if (usRelease?.release_dates?.[0]?.certification) {
      return usRelease.release_dates[0].certification;
    }
  }

  // For TV shows
  if (details.content_ratings?.results) {
    const usRating = details.content_ratings.results.find(r => r.iso_3166_1 === 'US');
    if (usRating?.rating) {
      return usRating.rating;
    }
  }

  // Fallback based on adult flag and vote average
  if (details.adult) return 'R';

  // Use vote count and popularity as heuristics
  if (!details.vote_average) return 'NR';

  return 'PG-13'; // Default fallback
};

// Get rating color
export const getRatingColor = (rating) => {
  const colors = {
    'G': 'bg-green-600',
    'PG': 'bg-blue-600',
    'PG-13': 'bg-yellow-600',
    'R': 'bg-red-600',
    'NC-17': 'bg-red-800',
    'TV-Y': 'bg-green-600',
    'TV-Y7': 'bg-green-600',
    'TV-G': 'bg-green-600',
    'TV-PG': 'bg-blue-600',
    'TV-14': 'bg-yellow-600',
    'TV-MA': 'bg-red-600',
    'NR': 'bg-gray-600'
  };
  return colors[rating] || 'bg-gray-600';
};
