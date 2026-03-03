import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { use3DCardEffect, useCardGlow, useMagneticEffect } from '../animations/cardAnimations';
import { useInView } from 'react-intersection-observer';

const AnimatedMovieCard = ({ movie, onClick }) => {
  const cardRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [isHovered, setIsHovered] = useState(false);

  use3DCardEffect(cardRef);
  useCardGlow(cardRef, {
    glowColor: 'rgba(255, 204, 0, 0.4)',
    intensity: 2
  });
  useMagneticEffect(cardRef, { strength: 0.2, radius: 150 });

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "back.out(1.7)",
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -15,
      scale: 1.05,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "power2.out"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "power2.inOut"
      }
    }
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1
      }
    }
  };

  const ratingVariants = {
    hidden: {
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <motion.div
      ref={(node) => {
        cardRef.current = node;
        ref(node);
      }}
      className="animated-movie-card"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 204, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Movie Poster */}
      <motion.div
        variants={imageVariants}
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: '300px'
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
        />
        
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.3s ease'
          }}
        />
      </motion.div>

      {/* Rating Badge */}
      <motion.div
        variants={ratingVariants}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'linear-gradient(135deg, #ffcc00, #ffd633)',
          color: '#121212',
          padding: '8px 12px',
          borderRadius: '50%',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(255, 204, 0, 0.4)',
          zIndex: 10
        }}
      >
        {movie.vote_average?.toFixed(1)}
      </motion.div>

      {/* Movie Info */}
      <motion.div
        variants={overlayVariants}
        style={{
          padding: '20px',
          color: '#ffffff'
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#ffcc00',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            lineHeight: '1.3'
          }}
        >
          {movie.title || movie.name}
        </h3>
        
        <p
          style={{
            fontSize: '14px',
            color: '#e0e0e0',
            marginBottom: '12px',
            opacity: 0.9
          }}
        >
          {new Date(movie.release_date || movie.first_air_date).getFullYear()}
        </p>

        {/* Hover Details */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: '12px',
              color: '#b0b0b0',
              lineHeight: '1.4'
            }}
          >
            {movie.overview?.substring(0, 100)}...
          </motion.div>
        )}
      </motion.div>

      {/* Play Button Overlay */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 204, 0, 0.9)',
            color: '#121212',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(255, 204, 0, 0.5)',
            zIndex: 20
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ marginLeft: '3px' }}
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </motion.div>
      )}

      {/* Shimmer Effect */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
};

export default AnimatedMovieCard;
