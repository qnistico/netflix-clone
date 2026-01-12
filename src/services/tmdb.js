const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
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

  // Get TV shows by genre
  getTVShowsByGenre: async (genreId) => {
    const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`);
    return res.json();
  },

  // Get filtered movies
  getFilteredMovies: async (filters = {}) => {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
    if (filters.genre && filters.genre !== 'all') {
      url += `&with_genres=${filters.genre}`;
    }
    if (filters.year && filters.year !== 'all') {
      url += `&primary_release_year=${filters.year}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  // Get filtered TV shows
  getFilteredTVShows: async (filters = {}) => {
    let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc`;
    if (filters.genre && filters.genre !== 'all') {
      url += `&with_genres=${filters.genre}`;
    }
    if (filters.year && filters.year !== 'all') {
      url += `&first_air_date_year=${filters.year}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  // Get top rated movies
  getTopRatedMovies: async () => {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    return res.json();
  },

  // Get top rated TV shows
  getTopRatedTVShows: async () => {
    const res = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
    return res.json();
  },

  // Get movie/show details
  getDetails: async (mediaType, id) => {
    const appendToResponse = mediaType === 'movie'
      ? 'videos,credits,release_dates'
      : 'videos,credits,content_ratings';
    const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=${appendToResponse}`);
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