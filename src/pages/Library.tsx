import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownAZ, Loader } from 'lucide-react';
import { discoverMovies } from '../services/api';
import type { Movie } from '../types/movie';

export default function Library() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageNum: number) => {
    try {
      const response = await discoverMovies({
        sort_by: 'title.asc',
        page: pageNum
      });
      
      if (pageNum === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }
      
      setHasMore(response.data.page < response.data.total_pages);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchMovies(page + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Movie Library
        </h1>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <ArrowDownAZ className="h-5 w-5" />
          <span>Sorted alphabetically</span>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-8">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069&auto=format&fit=crop';
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {movie.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${
                  movie.vote_average >= 7 ? 'bg-rating-high text-white' :
                  movie.vote_average >= 5 ? 'bg-rating-medium text-white' :
                  'bg-rating-low text-white'
                }`}>
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!loading && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Load More Movies
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-8">
          <Loader className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
}