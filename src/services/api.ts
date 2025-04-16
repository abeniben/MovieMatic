import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getPopularMovies = (page = 1) => {
  return api.get('/movie/popular', { params: { page } });
};

export const searchMovies = (query: string, page = 1) => {
  return api.get('/search/movie', { params: { query, page } });
};

export const getMovieDetails = (movieId: string) => {
  return api.get(`/movie/${movieId}`);
};

export const getGenres = () => {
  return api.get('/genre/movie/list');
};

export const discoverMovies = (params: {
  with_genres?: string;
  primary_release_year?: string;
  sort_by?: string;
  page?: number;
}) => {
  return api.get('/discover/movie', { params });
};