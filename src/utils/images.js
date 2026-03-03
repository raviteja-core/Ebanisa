const TMDB_BASE = 'https://image.tmdb.org/t/p';
const SVG_DATA_PREFIX = 'data:image/svg+xml;charset=UTF-8,';

const createFallbackImage = (label, width, height) =>
  `${SVG_DATA_PREFIX}${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1d1d1d"/>
          <stop offset="100%" stop-color="#333333"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffcc00" font-family="Arial, sans-serif" font-size="28" font-weight="700">${label}</text>
    </svg>`
  )}`;

const FALLBACK_MEDIA_IMAGE = createFallbackImage('No Image', 1280, 720);
const FALLBACK_CAST_IMAGE = createFallbackImage('No Photo', 800, 1000);

export const getTmdbImage = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_BASE}/${size}${path}`;
};

export const getCardImageUrl = (item, size = 'w780') =>
  getTmdbImage(item?.backdrop_path || item?.poster_path, size) || FALLBACK_MEDIA_IMAGE;

export const getCastImageUrl = (member, size = 'w500') =>
  getTmdbImage(member?.profile_path, size) || FALLBACK_CAST_IMAGE;

export const hasCardImage = (item) => Boolean(item?.backdrop_path || item?.poster_path);

export const hasCastImage = (member) => Boolean(member?.profile_path);

export const getMediaYear = (item) =>
  item?.release_date?.split('-')[0] || item?.first_air_date?.split('-')[0] || 'N/A';

export const getMediaRating = (item) =>
  typeof item?.vote_average === 'number' && item.vote_average > 0
    ? item.vote_average.toFixed(1)
    : 'N/A';
