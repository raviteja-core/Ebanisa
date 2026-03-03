import React from 'react';
import { Link } from 'react-router-dom';
import { getCardImageUrl, getMediaRating, getMediaYear } from '../utils/images';

function MediaCard({ item, linkTo }) {
  const imageUrl = getCardImageUrl(item);
  const title = item.title || item.name || 'Untitled';

  return (
    <li className="movie-card modern-card media-card">
      <div className="card-img-wrap">
        <img src={imageUrl} alt={title} className="modern-img" />
      </div>
      <div className="movie-info">
        <h3>{title}</h3>
        <div className="media-meta">
          <span className="meta-pill">Year: {getMediaYear(item)}</span>
          <span className="meta-pill">Rating: {getMediaRating(item)}</span>
        </div>
      </div>
      <div className="movie-hover modern-hover">
        <p>{(item.overview || 'No description available.').slice(0, 110)}...</p>
        <Link to={linkTo}><button>View Details</button></Link>
      </div>
    </li>
  );
}

export default MediaCard;
