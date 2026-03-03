import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    fetchMovieDetail,
    fetchMovieCredits,
    fetchSimilarMovies,
    fetchMovieRecommendations,
    fetchPopularMovies,
    fetchMovieImages,
} from '../api';
import MediaCard from './MediaCard';
import CastCard from './CastCard';

const dedupeById = (items = []) =>
    items.filter((item, index, arr) => index === arr.findIndex((x) => x.id === item.id));

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [images, setImages] = useState([]);
    const [showAllCast, setShowAllCast] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const CAST_PREVIEW_COUNT = 8;
    const IMAGE_PREVIEW_COUNT = 6;

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const [detail, credits, similar, recommendations, popular, imageData] = await Promise.all([
                fetchMovieDetail(id),
                fetchMovieCredits(id),
                fetchSimilarMovies(id),
                fetchMovieRecommendations(id),
                fetchPopularMovies(1),
                fetchMovieImages(id),
            ]);

            if (cancelled) return;

            const relatedPool = dedupeById([
                ...(similar.results || []),
                ...(recommendations.results || []),
                ...(popular.results || []).filter((item) => item.id !== Number(id)),
            ]);

            setMovie(detail);
            setCast((credits.cast || []).slice(0, 18));
            setRelatedMovies(relatedPool.slice(0, 18));
            setImages(imageData.backdrops || []);
            setShowAllCast(false);
            setShowAllImages(false);
            setActiveImageIndex(null);
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        if (activeImageIndex === null || images.length === 0) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setActiveImageIndex(null);
            if (e.key === 'ArrowLeft') {
                setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
            }
            if (e.key === 'ArrowRight') {
                setActiveImageIndex((prev) => (prev + 1) % images.length);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [activeImageIndex, images.length]);

    if (!movie) return <div>Loading...</div>;

    const visibleCast = showAllCast ? cast : cast.slice(0, CAST_PREVIEW_COUNT);
    const canToggleCast = cast.length > CAST_PREVIEW_COUNT;
    const visibleImages = showAllImages ? images : images.slice(0, IMAGE_PREVIEW_COUNT);
    const canToggleImages = images.length > IMAGE_PREVIEW_COUNT;
    const activeImagePath = activeImageIndex !== null ? images[activeImageIndex]?.file_path : null;

    return (
        <div className="movie-detail modern-detail-page">
            {/* Backdrop Section */}
            <div
                className="backdrop"
                style={movie.backdrop_path ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` } : {}}
            >
                <div className="backdrop-overlay">
                    <h1>{movie.title}</h1>
                    <p>{movie.tagline}</p>
                </div>
            </div>
            {/* Main Details Section */}
            <div className="details-container modern-details-container">
                {movie.poster_path && (
                    <div className="poster">
                        <img src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} alt={movie.title} />
                    </div>
                )}
                <div className="details">
                    <h2>{movie.title}</h2>
                    <p><strong>Release Date:</strong> {movie.release_date}</p>
                    <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                    <p><strong>Budget:</strong> ${(movie.budget || 0).toLocaleString()}</p>
                    <p><strong>Revenue:</strong> ${(movie.revenue || 0).toLocaleString()}</p>
                    <p><strong>Genres:</strong> {(movie.genres || []).map(genre => <span key={genre.id} className="genre-chip">{genre.name}</span>)}</p>
                    <p><strong>Spoken Languages:</strong> {(movie.spoken_languages || []).map(lang => lang.name).join(', ')}</p>
                    <p><strong>Production Companies:</strong> {(movie.production_companies || []).map(company => company.name).join(', ')}</p>
                    <p><strong>Rating:</strong> <span className="rating-badge">{movie.vote_average}</span></p>
                    <p>{movie.overview}</p>
                </div>
            </div>
            {/* Cast Section */}
            <div className="section">
                <h2>Cast</h2>
                {cast.length > 0 ? (
                    <>
                        <ul className="cast-grid">
                            {visibleCast.map(member => <CastCard key={member.id} member={member} />)}
                        </ul>
                        {canToggleCast && (
                            <div className="section-actions">
                                <button onClick={() => setShowAllCast((prev) => !prev)}>
                                    {showAllCast ? 'Show Less Cast' : `View All Cast (${cast.length})`}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="section-desc">No cast information is available for this title.</p>
                )}
            </div>
            {/* Related Movies */}
            <div className="section">
                <h2>Related Movies</h2>
                {relatedMovies.length > 0 ? (
                    <ul className="media-grid">
                        {relatedMovies.map(movie => (
                            <MediaCard key={movie.id} item={movie} linkTo={`/movie/${movie.id}`} />
                        ))}
                    </ul>
                ) : (
                    <p className="section-desc">No related movies were found yet.</p>
                )}
            </div>
            {/* Gallery Section */}
            <div className="section">
                <h2>Gallery</h2>
                {images.length > 0 ? (
                    <>
                        <div className="slider">
                            {visibleImages.map((img, index) => (
                                <div
                                    key={img.file_path}
                                    className="slider-item"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveImageIndex(index)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') setActiveImageIndex(index);
                                    }}
                                >
                                    <img src={`https://image.tmdb.org/t/p/w500${img.file_path}`} alt="Gallery" />
                                </div>
                            ))}
                        </div>
                        {canToggleImages && (
                            <div className="section-actions">
                                <button onClick={() => setShowAllImages((prev) => !prev)}>
                                    {showAllImages ? 'Show Less Images' : `View More Images (${images.length})`}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="section-desc">No gallery images are available for this movie.</p>
                )}
            </div>
            {activeImagePath && (
                <div className="lightbox" onClick={() => setActiveImageIndex(null)}>
                    <button className="lightbox-close" onClick={() => setActiveImageIndex(null)}>Close</button>
                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
                        }}
                    >
                        ‹
                    </button>
                    <img
                        className="lightbox-image"
                        src={`https://image.tmdb.org/t/p/original${activeImagePath}`}
                        alt="Expanded gallery"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev + 1) % images.length);
                        }}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}

export default MovieDetail;
