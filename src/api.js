const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

let hasWarnedMissingApiKey = false;

const buildUrl = (path, params = {}) => {
  const searchParams = new URLSearchParams({
    ...params,
    api_key: API_KEY || '',
  });

  return `${BASE_URL}${path}?${searchParams.toString()}`;
};

const request = async (path, params = {}) => {
  if (!API_KEY) {
    if (!hasWarnedMissingApiKey) {
      hasWarnedMissingApiKey = true;
      // eslint-disable-next-line no-console
      console.error('Missing REACT_APP_TMDB_API_KEY. Add it to your environment variables.');
    }
    return {};
  }

  try {
    const response = await fetch(buildUrl(path, params));
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(`TMDB request failed: ${response.status} ${response.statusText} (${path})`);
      return {};
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`TMDB request error (${path}):`, error);
    return {};
  }
};

// Configuration Data
export const fetchConfiguration = () => request('/configuration');

// Genre Lists
export const fetchMovieGenres = () => request('/genre/movie/list');
export const fetchTVGenres = () => request('/genre/tv/list');

// Movie Data
export const fetchPopularMovies = (page = 1) => request('/movie/popular', { page });
export const fetchTopRatedMovies = (page = 1) => request('/movie/top_rated', { page });
export const fetchUpcomingMovies = (page = 1) => request('/movie/upcoming', { page });
export const fetchNowPlayingMovies = (page = 1) => request('/movie/now_playing', { page });
export const fetchMovieDetail = (id) => request(`/movie/${id}`);
export const fetchMovieCredits = (id) => request(`/movie/${id}/credits`);
export const fetchMovieVideos = (id) => request(`/movie/${id}/videos`);
export const fetchSimilarMovies = (id) => request(`/movie/${id}/similar`);
export const fetchMovieRecommendations = (id) => request(`/movie/${id}/recommendations`);

// TV Show Data
export const fetchPopularTVShows = (page = 1) => request('/tv/popular', { page });
export const fetchTopRatedTVShows = (page = 1) => request('/tv/top_rated', { page });
export const fetchAiringTodayTVShows = (page = 1) => request('/tv/airing_today', { page });
export const fetchOnTheAirTVShows = (page = 1) => request('/tv/on_the_air', { page });
export const fetchTVShowDetail = (id) => request(`/tv/${id}`);
export const fetchTVShowCredits = (id) => request(`/tv/${id}/credits`);
export const fetchTVShowVideos = (id) => request(`/tv/${id}/videos`);
export const fetchSimilarTVShows = (id) => request(`/tv/${id}/similar`);
export const fetchTVShowRecommendations = (id) => request(`/tv/${id}/recommendations`);

// Search Functionality
export const searchMovies = (query, page = 1) => request('/search/movie', { query, page });
export const searchTVShows = (query, page = 1) => request('/search/tv', { query, page });
export const multiSearch = (query, page = 1) => request('/search/multi', { query, page });

// Trending and Discover
export const fetchTrendingContent = (mediaType = 'all', timeWindow = 'day') =>
  request(`/trending/${mediaType}/${timeWindow}`);
export const discoverMovies = (params) => request('/discover/movie', params);
export const discoverTVShows = (params) => request('/discover/tv', params);

// Optional / Extended Data
export const fetchMovieImages = (id) => request(`/movie/${id}/images`);
export const fetchTVShowImages = (id) => request(`/tv/${id}/images`);
export const fetchMovieExternalIDs = (id) => request(`/movie/${id}/external_ids`);
export const fetchTVShowExternalIDs = (id) => request(`/tv/${id}/external_ids`);
export const fetchMovieReviews = (id, page = 1) => request(`/movie/${id}/reviews`, { page });
export const fetchTVShowReviews = (id, page = 1) => request(`/tv/${id}/reviews`, { page });
