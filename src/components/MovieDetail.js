import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetail, fetchMovieCredits, fetchSimilarMovies, fetchMovieVideos, fetchMovieImages } from '../api';

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);
    const [showAllImages, setShowAllImages] = useState(false);

    useEffect(() => {
        fetchMovieDetail(id).then(data => setMovie(data));
        fetchMovieCredits(id).then(data => setCast(data.cast || []));
        fetchSimilarMovies(id).then(data => setRelatedMovies(data.results || []));
        fetchMovieVideos(id).then(data => setVideos(data.results || []));
        fetchMovieImages(id).then(data => setImages(data.backdrops || []));
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-detail modern-detail-page">
            {/* Backdrop Section */}
            <div className="backdrop" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}>
                <div className="backdrop-overlay">
                    <h1>{movie.title}</h1>
                    <p>{movie.tagline}</p>
                </div>
            </div>
            {/* Main Details Section */}
            <div className="details-container modern-details-container">
                <div className="poster">
                    <img src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} alt={movie.title} />
                </div>
                <div className="details">
                    <h2>{movie.title}</h2>
                    <p><strong>Release Date:</strong> {movie.release_date}</p>
                    <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                    <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
                    <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
                    <p><strong>Genres:</strong> {movie.genres.map(genre => <span key={genre.id} className="genre-chip">{genre.name}</span>)}</p>
                    <p><strong>Spoken Languages:</strong> {movie.spoken_languages.map(lang => lang.name).join(', ')}</p>
                    <p><strong>Production Companies:</strong> {movie.production_companies.map(company => company.name).join(', ')}</p>
                    <p><strong>Rating:</strong> <span className="rating-badge">{movie.vote_average}</span></p>
                    <p>{movie.overview}</p>
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
            {/* Related Movies */}
            <div className="section">
                <h2>Related Movies</h2>
                <ul className="movie-grid modern-grid">
                    {relatedMovies.map(movie => (
                        <li key={movie.id} className="movie-card modern-card">
                            <div className="card-img-wrap">
                                <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="modern-img" />
                                <span className="rating-badge">{movie.vote_average}</span>
                            </div>
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <div className="genre-chips">{movie.genre_ids && movie.genre_ids.map(id => <span key={id} className="genre-chip">{id}</span>)}</div>
                            </div>
                            <div className="movie-hover modern-hover">
                                <Link to={`/movie/${movie.id}`}><button>View Details</button></Link>
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

export default MovieDetail;
