const API_KEY = '5c23dfe4fd13f5c2667fda0aebf48fc6'; // We'll get this in a minute
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdb = {
  // Get trending movies/shows
  getTrending: async (mediaType = 'all', timeWindow = 'week') => {
    const res = await fetch(`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`);
    return res.json();
  },

  // Get popular movies
  getPopularMovies: async () => {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    return res.json();
  },

  // Get popular TV shows
  getPopularTVShows: async () => {
    const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    return res.json();
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId) => {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    return res.json();
  },

  // Get movie/show details
  getDetails: async (mediaType, id) => {
    const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=videos`);
    return res.json();
  },

  // Search
  search: async (query) => {
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Helper to build image URLs
  getImageUrl: (path, size = 'original') => {
    if (!path) return '/placeholder.png';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};

export default tmdb;