import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { getPopularMovies, searchMovies, getGenres, discoverMovies } from '../services/api';
import type { Movie, Genre } from '../types/movie';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          getPopularMovies(),
          getGenres()
        ]);
        setMovies(moviesResponse.data.results);
        setGenres(genresResponse.data.genres);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await searchMovies(searchQuery);
      } else if (selectedGenre || selectedYear) {
        response = await discoverMovies({
          with_genres: selectedGenre,
          primary_release_year: selectedYear,
          sort_by: 'popularity.desc'
        });
      } else {
        response = await getPopularMovies();
      }
      setMovies(response.data.results);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Your Next Favorite Movie
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Search through millions of movies and find the perfect one for you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Years</option>
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Filter className="h-5 w-5" />
          Apply & Search
        </button>
      </div>

      {/* Movies Grid */}
      {error && (
        <div className="text-center text-red-500 mb-8">{error}</div>
      )}
      
      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300 text-xl py-8">
          No movies found with that title
        </div>
      ) : (
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
      )}
    </div>
  );
}