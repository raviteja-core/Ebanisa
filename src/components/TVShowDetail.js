import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTVShowDetail, fetchTVShowCredits, fetchSimilarTVShows, fetchTVShowVideos, fetchTVShowImages } from '../api';

function TVShowDetail() {
    const { id } = useParams();
    const [tvShow, setTVShow] = useState(null);
    const [cast, setCast] = useState([]);
    const [relatedShows, setRelatedShows] = useState([]);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);
    const [showAllImages, setShowAllImages] = useState(false);

    useEffect(() => {
        fetchTVShowDetail(id).then(data => setTVShow(data));
        fetchTVShowCredits(id).then(data => setCast(data.cast || []));
        fetchSimilarTVShows(id).then(data => setRelatedShows(data.results || []));
        fetchTVShowVideos(id).then(data => setVideos(data.results || []));
        fetchTVShowImages(id).then(data => setImages(data.backdrops || []));
    }, [id]);

    if (!tvShow) return <div>Loading...</div>;

    return (
        <div className="tv-show-detail modern-detail-page">
            {/* Backdrop Section */}
            <div className="backdrop" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})` }}>
                <div className="backdrop-overlay">
                    <h1>{tvShow.name}</h1>
                    <p>{tvShow.tagline}</p>
                </div>
            </div>
            {/* Main Details Section */}
            <div className="details-container modern-details-container">
                <div className="poster">
                    <img src={`https://image.tmdb.org/t/p/w780${tvShow.poster_path}`} alt={tvShow.name} />
                </div>
                <div className="details">
                    <h2>{tvShow.name}</h2>
                    <p><strong>First Air Date:</strong> {tvShow.first_air_date}</p>
                    <p><strong>Seasons:</strong> {tvShow.number_of_seasons}</p>
                    <p><strong>Episodes:</strong> {tvShow.number_of_episodes}</p>
                    <p><strong>Genres:</strong> {tvShow.genres.map(genre => <span key={genre.id} className="genre-chip">{genre.name}</span>)}</p>
                    <p><strong>Networks:</strong> {tvShow.networks.map(network => network.name).join(', ')}</p>
                    <p><strong>Rating:</strong> <span className="rating-badge">{tvShow.vote_average}</span></p>
                    <p>{tvShow.overview}</p>
                </div>
            </div>
            {/* Cast Section */}
            <div className="section">
                <h2>Cast</h2>
                <ul className="cast-grid">
                    {cast.map(member => (
                        <li key={member.id}>
                            <img src={member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : 'https://via.placeholder.com/100x100?text=No+Image'} alt={member.name} />
                            <p>{member.name}</p>
                            <span>{member.character}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Related TV Shows */}
            <div className="section">
                <h2>Related TV Shows</h2>
                <ul className="movie-grid modern-grid">
                    {relatedShows.map(show => (
                        <li key={show.id} className="movie-card modern-card">
                            <div className="card-img-wrap">
                                <img src={`https://image.tmdb.org/t/p/w300${show.poster_path}`} alt={show.name} className="modern-img" />
                                <span className="rating-badge">{show.vote_average}</span>
                            </div>
                            <div className="movie-info">
                                <h3>{show.name}</h3>
                                <div className="genre-chips">{show.genre_ids && show.genre_ids.map(id => <span key={id} className="genre-chip">{id}</span>)}</div>
                            </div>
                            <div className="movie-hover modern-hover">
                                <Link to={`/tv/${show.id}`}><button>View Details</button></Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Gallery Section */}
            <div className="section">
                <h2>Gallery</h2>
                <div className="slider">
                    {images.map(img => (
                        <div key={img.file_path} className="slider-item">
                            <img src={`https://image.tmdb.org/t/p/w500${img.file_path}`} alt="Gallery" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TVShowDetail;
