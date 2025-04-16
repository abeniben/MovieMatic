import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { getMovieDetails } from '../services/api';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
}

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        const response = await getMovieDetails(id);
        setMovie(response.data);
      } catch (err) {
        setError('Failed to fetch movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500">{error || 'Movie not found'}</div>
      </div>
    );
  }

  return (
    <div className='mt-4'>
      {/* Backdrop Image */}
      <div 
        className="relative h-[70vh] md:h-[70vh] lg:h-[50vh] bg-cover bg-center mt-10 overflow-y-auto"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className="absolute inset-0 flex items-start md:items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 md:py-0">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              {/* Poster */}
              <div className="flex justify-center md:justify-start mb-4 md:mb-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg shadow-xl w-40 h-60 sm:w-48 sm:h-72 md:w-96 md:h-80 lg:96 lg:h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2069&auto=format&fit=crop';
                  }}
                />
              </div>
              
              {/* Movie Info */}
              <div className="text-white pt-0 md:pt-8 lg:pt-16 text-center md:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">{movie.title}</h1>
                
                <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 mb-2 md:mb-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3 md:mb-6 justify-center md:justify-start">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 md:px-3 py-1 bg-gray-800 rounded-full text-xs md:text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed px-2 md:px-0">
                  {movie.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Back Button Below Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-20">
        <div className="flex justify-center md:justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded shadow"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}