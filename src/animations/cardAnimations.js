import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const use3DCardEffect = (cardRef) => {
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cardRef]);
};

export const useCardFloat = (cardRef, options = {}) => {
  const { amplitude = 5, frequency = 0.01 } = options;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let animationFrame;
    let time = 0;

    const animate = () => {
      time += frequency;
      const y = Math.sin(time) * amplitude;
      
      gsap.set(card, {
        y: y,
        rotationY: Math.sin(time * 0.5) * 2
      });
      
      animationFrame = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      animate();
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(animationFrame);
      gsap.to(card, {
        y: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [cardRef, amplitude, frequency]);
};

export const useCardGlow = (cardRef, options = {}) => {
  const { 
    glowColor = 'rgba(255, 204, 0, 0.3)', 
    intensity = 1.5 
  } = options;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (x - centerX) / centerX;
      const angleY = (y - centerY) / centerY;
      
      const glowX = angleX * intensity * 20;
      const glowY = angleY * intensity * 20;
      
      gsap.to(card, {
        boxShadow: `${glowX}px ${glowY}px 30px ${glowColor}`,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cardRef, glowColor, intensity]);
};

export const useCardFlip = (cardRef, triggerRef) => {
  const isFlipped = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    const trigger = triggerRef?.current;
    if (!card || !trigger) return;

    const handleClick = () => {
      isFlipped.current = !isFlipped.current;

      gsap.to(card, {
        rotationY: isFlipped.current ? 180 : 0,
        duration: 0.6,
        ease: "power2.inOut",
        transformPerspective: 1000
      });
    };

    trigger.addEventListener('click', handleClick);

    return () => {
      trigger.removeEventListener('click', handleClick);
    };
  }, [cardRef, triggerRef]);

  return isFlipped.current;
};

export const useMagneticEffect = (elementRef, options = {}) => {
  const { strength = 0.3, radius = 100 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance >= radius) return;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, strength, radius]);
};

// Advanced shimmer effect for cards
export const useShimmerEffect = (elementRef) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const shimmer = document.createElement('div');
    shimmer.className = 'shimmer-overlay';
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(shimmer);

    const handleMouseMove = () => {
      gsap.to(shimmer, {
        left: '100%',
        duration: 0.6,
        ease: "power2.inOut"
      });
    };

    element.addEventListener('mouseenter', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseMove);
      shimmer.remove();
    };
  }, [elementRef]);
};

// Particle burst effect on click
export const useParticleBurst = (elementRef) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleClick = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #ffcc00, rgba(255,204,0,0));
          border-radius: 50%;
          pointer-events: none;
          left: ${rect.left + x}px;
          top: ${rect.top + y}px;
          box-shadow: 0 0 10px rgba(255,204,0,0.8);
        `;
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 3 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        gsap.to(particle, {
          x: vx * 100,
          y: vy * 100,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => particle.remove()
        });
      }
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [elementRef]);
};

// Advanced border animation
export const useBorderAnimation = (elementRef, { color = '#ffcc00', speed = 2 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      backgroundPosition: `${speed * 100}% center`,
      duration: speed,
      repeat: -1,
      ease: "none"
    });
  }, [elementRef, color, speed]);
};

// Liquid swipe effect (advanced)
export const useLiquidSwipe = (elementRef) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element, {
      clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
    });

    const handleMouseEnter = () => {
      gsap.to(element, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        duration: 0.4,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);
};

// Depth shadow effect
export const useDepthShadow = (elementRef) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        boxShadow: `
          0 20px 25px rgba(0, 0, 0, 0.4),
          0 40px 60px rgba(255, 204, 0, 0.2),
          0 60px 80px rgba(0, 0, 0, 0.3)
        `,
        duration: 0.4
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        duration: 0.4
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);
};
