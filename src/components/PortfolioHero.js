import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useParallax, useScaleReveal, useRotateReveal } from '../animations/scrollAnimations';
import { useInView } from 'react-intersection-observer';

const PortfolioHero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20 });

  useParallax(heroRef, 0.5);
  useScaleReveal(titleRef, { duration: 1.2, delay: 0.2 });
  useRotateReveal(subtitleRef, { duration: 1, delay: 0.5, rotation: 90 });
  useScaleReveal(ctaRef, { duration: 0.8, delay: 0.8 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const particleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      y: [-100, -300],
      x: [0, Math.random() * 200 - 100],
      transition: {
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        y: smoothY,
        opacity: smoothOpacity,
        scale: smoothScale
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 204, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255, 204, 0, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(255, 204, 0, 0.08) 0%, transparent 50%)
          `,
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease'
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          variants={particleVariants}
          initial="initial"
          animate="animate"
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            backgroundColor: '#ffcc00',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 204, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 204, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.3s ease'
        }}
      />

      {/* Hero Content */}
      <div
        ref={ref}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '1200px',
          padding: '0 20px'
        }}
      >
        {/* Main Title */}
        <motion.h1
          ref={titleRef}
          variants={floatingVariants}
          animate="animate"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '800',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffcc00, #ffd633, #ffcc00)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 10px 30px rgba(255, 204, 0, 0.3)',
            letterSpacing: '-2px',
            lineHeight: '1.1',
            animation: 'gradientShift 3s ease infinite'
          }}
        >
          CINEMATIC
          <br />
          EXPERIENCE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: '#e0e0e0',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
            opacity: 0.9,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          Discover the magic of movies with stunning visuals and immersive interactions
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          ref={ctaRef}
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 204, 0, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #ffcc00, #ffd633)',
              color: '#121212',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 6px 20px rgba(255, 204, 0, 0.3)'
            }}
          >
            Explore Movies
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: '#ffcc00', color: '#ffcc00' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              background: 'transparent',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Watch Trailer
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ color: '#ffcc00', fontSize: '14px', textTransform: 'uppercase' }}>
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: '30px',
              height: '50px',
              border: '2px solid #ffcc00',
              borderRadius: '25px',
              position: 'relative',
              opacity: 0.8
            }}
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: '6px',
                height: '10px',
                backgroundColor: '#ffcc00',
                borderRadius: '3px',
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to top, #121212, transparent)',
          pointerEvents: 'none'
        }}
      />

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.section>
  );
};

export default PortfolioHero;
