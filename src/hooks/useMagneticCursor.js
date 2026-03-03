import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useMagneticCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // Check if we're on mobile/touch device
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
              (navigator.maxTouchPoints > 0) ||
              (navigator.msMaxTouchPoints > 0));
    };

    if (isTouchDevice()) {
      return; // Don't create custom cursor on mobile
    }

    // Create cursor elements if they don't exist
    if (!cursorRef.current) {
      const cursor = document.createElement('div');
      cursor.id = 'cursor';
      cursorRef.current = cursor;
      document.body.appendChild(cursor);
    }

    if (!followerRef.current) {
      const follower = document.createElement('div');
      follower.id = 'cursor-follower';
      followerRef.current = follower;
      document.body.appendChild(follower);
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Immediate cursor movement
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          left: mouseX - 6,
          top: mouseY - 6,
          duration: 0,
          overwrite: 'auto'
        });
      }

      // Smooth follower movement
      if (followerRef.current) {
        gsap.to(followerRef.current, {
          left: mouseX - 20,
          top: mouseY - 20,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
      }
      if (followerRef.current) {
        gsap.to(followerRef.current, { opacity: 1, duration: 0.3 });
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
      }
      if (followerRef.current) {
        gsap.to(followerRef.current, { opacity: 0, duration: 0.3 });
      }
    };

    // Hover effect over interactive elements
    const handleMouseOverInteractive = (e) => {
      const isInteractive = e.target.tagName === 'BUTTON' || 
                           e.target.tagName === 'A' || 
                           e.target.classList.contains('movie-card') ||
                           e.target.closest('button') ||
                           e.target.closest('a');
      
      if (isInteractive) {
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            width: 8,
            height: 8,
            boxShadow: '0 0 30px rgba(255, 204, 0, 1)',
            duration: 0.3
          });
        }
        if (followerRef.current) {
          gsap.to(followerRef.current, {
            width: 50,
            height: 50,
            borderColor: 'rgba(255, 204, 0, 0.8)',
            duration: 0.3
          });
        }
      }
    };

    const handleMouseOutInteractive = (e) => {
      const isInteractive = e.target.tagName === 'BUTTON' || 
                           e.target.tagName === 'A' || 
                           e.target.classList.contains('movie-card') ||
                           e.target.closest('button') ||
                           e.target.closest('a');
      
      if (isInteractive) {
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            width: 12,
            height: 12,
            boxShadow: '0 0 20px rgba(255, 204, 0, 0.8)',
            duration: 0.3
          });
        }
        if (followerRef.current) {
          gsap.to(followerRef.current, {
            width: 40,
            height: 40,
            borderColor: 'rgba(255, 204, 0, 0.4)',
            duration: 0.3
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOverInteractive);
    document.addEventListener('mouseout', handleMouseOutInteractive);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOverInteractive);
      document.removeEventListener('mouseout', handleMouseOutInteractive);
      
      // Cleanup elements
      if (cursorRef.current && cursorRef.current.parentNode) {
        cursorRef.current.parentNode.removeChild(cursorRef.current);
      }
      if (followerRef.current && followerRef.current.parentNode) {
        followerRef.current.parentNode.removeChild(followerRef.current);
      }
    };
  }, []);
};
