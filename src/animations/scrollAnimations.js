import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const createRevealTrigger = (element, tweenConfig, start = 'top 85%') =>
  ScrollTrigger.create({
    trigger: element,
    start,
    once: true,
    onEnter: () => gsap.to(element, tweenConfig),
  });

export const useParallax = (elementRef, speed = 0.25) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const trigger = gsap.to(element, {
      yPercent: -speed * 25,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, [elementRef, speed]);
};

export const use3DParallax = (elementRef, { speed = 0.2, depth = 1 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const tween = gsap.to(element, {
      yPercent: -speed * 20,
      rotateX: depth * 2,
      ease: 'none',
      transformPerspective: 1000,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [elementRef, speed, depth]);
};

export const useFloatingAnimation = (elementRef, { distance = 10, duration = 3 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const tween = gsap.to(element, {
      y: distance,
      duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => tween.kill();
  }, [elementRef, distance, duration]);
};

export const useMagneticHover = (elementRef, { strength = 0.2 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const handleMouseMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;

      gsap.to(element, {
        x,
        y,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, strength]);
};

export const useScrollReveal = (elementRef, options = {}) => {
  const {
    direction = 'up',
    duration = 0.7,
    delay = 0,
    distance = 40,
    blur = 0,
    rotation = 0,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const axisKey = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const axisValue =
      direction === 'up' ? distance :
      direction === 'down' ? -distance :
      direction === 'left' ? distance : -distance;

    const initial = {
      opacity: 0,
      [axisKey]: axisValue,
      rotation,
    };

    if (blur > 0) initial.filter = `blur(${blur}px)`;

    gsap.set(element, initial);

    const trigger = createRevealTrigger(element, {
      opacity: 1,
      [axisKey]: 0,
      rotation: 0,
      filter: 'blur(0px)',
      duration,
      delay,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    return () => trigger.kill();
  }, [elementRef, direction, duration, delay, distance, blur, rotation]);
};

export const useStaggerReveal = (elementsRef, options = {}) => {
  const { staggerDelay = 0.1, direction = 'up', duration = 0.6, distance = 24 } = options;

  useEffect(() => {
    const elements = elementsRef.current?.filter(Boolean) || [];
    if (elements.length === 0) return undefined;

    const axisKey = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const axisValue =
      direction === 'up' ? distance :
      direction === 'down' ? -distance :
      direction === 'left' ? distance : -distance;

    gsap.set(elements, { opacity: 0, [axisKey]: axisValue });

    const trigger = ScrollTrigger.create({
      trigger: elements[0],
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(elements, {
          opacity: 1,
          [axisKey]: 0,
          duration,
          stagger: staggerDelay,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, [elementsRef, staggerDelay, direction, duration, distance]);
};

export const useScaleReveal = (elementRef, options = {}) => {
  const { duration = 0.7, delay = 0, scale = 0.92 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    gsap.set(element, { opacity: 0, scale });

    const trigger = createRevealTrigger(element, {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: 'power3.out',
    });

    return () => trigger.kill();
  }, [elementRef, duration, delay, scale]);
};

export const useRotateReveal = (elementRef, options = {}) => {
  const { duration = 0.8, delay = 0, rotation = 90 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    gsap.set(element, { opacity: 0, rotation });

    const trigger = createRevealTrigger(element, {
      opacity: 1,
      rotation: 0,
      duration,
      delay,
      ease: 'power3.out',
    });

    return () => trigger.kill();
  }, [elementRef, duration, delay, rotation]);
};

export const useWaveAnimation = (elementRef, { amplitude = 8, speed = 1.5 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const tween = gsap.to(element, {
      y: amplitude,
      duration: speed,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => tween.kill();
  }, [elementRef, amplitude, speed]);
};

export const useCounterAnimation = (elementRef, { endValue = 100, duration = 1.5 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: endValue,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = `${Math.floor(counter.value)}`;
          },
        });
      },
    });

    return () => trigger.kill();
  }, [elementRef, endValue, duration]);
};

export const useTextReveal = (elementRef, { duration = 1, stagger = 0.03 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const text = element.textContent || '';
    element.innerHTML = text
      .split('')
      .map((char) => `<span style="opacity:0;">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const chars = element.querySelectorAll('span');

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          duration: duration / Math.max(chars.length, 1),
          stagger,
          ease: 'power2.out',
        });
      },
    });

    return () => trigger.kill();
  }, [elementRef, duration, stagger]);
};

export const useScrollBackground = (elementRef, { speed = 1 } = {}) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const tween = gsap.to(element, {
      backgroundPosition: '100% 50%',
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: speed,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [elementRef, speed]);
};

export const useGlitchAnimation = (elementRef) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const glitch = () => {
      gsap.fromTo(
        element,
        { x: -2, y: 2 },
        {
          x: 2,
          y: -2,
          duration: 0.05,
          repeat: 3,
          yoyo: true,
          clearProps: 'transform',
        }
      );
    };

    element.addEventListener('mouseenter', glitch);
    return () => element.removeEventListener('mouseenter', glitch);
  }, [elementRef]);
};
