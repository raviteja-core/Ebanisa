import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SECTION_SELECTORS = [
  '.page-title',
  '.section',
  '.section-desc',
  '.details-container',
  '.search-bar',
  '.sticky-filters',
  '.filters',
  '.media-grid',
  '.cast-grid',
  '.slider',
  '.pagination',
  '.floating-load-more',
  '.no-results',
].join(', ');

const HERO_SELECTORS = '.hero, .backdrop';
const DEPTH_SELECTORS = '.hero-overlay, .backdrop-overlay, .modern-details-container';
const CARD_GROUP_SELECTORS = '.media-grid, .cast-grid, .slider';

const setupSectionReveal = (element, cleanups) => {
  if (element.dataset.scrollFxReveal === 'true') return;
  element.dataset.scrollFxReveal = 'true';
  element.classList.add('scroll-fx-section');

  gsap.set(element, {
    opacity: 0,
    y: 54,
    rotateX: 5,
    transformPerspective: 1100,
    transformOrigin: '50% 100%',
  });

  const trigger = ScrollTrigger.create({
    trigger: element,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.95,
        ease: 'power3.out',
        clearProps: 'transformPerspective,transformOrigin',
      });
    },
  });

  cleanups.push(() => trigger.kill());
};

const setupHeroParallax = (element, cleanups) => {
  if (element.dataset.scrollFxParallax === 'true') return;
  element.dataset.scrollFxParallax = 'true';
  element.classList.add('scroll-fx-hero');

  const tween = gsap.fromTo(
    element,
    { yPercent: -8, scale: 1.05 },
    {
      yPercent: 8,
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.1,
      },
    }
  );

  cleanups.push(() => {
    tween.scrollTrigger?.kill();
    tween.kill();
  });
};

const setupDepthShift = (element, cleanups) => {
  if (element.dataset.scrollFxDepth === 'true') return;
  element.dataset.scrollFxDepth = 'true';
  element.classList.add('scroll-fx-depth');

  const tween = gsap.fromTo(
    element,
    { y: 30, rotateX: -6, z: -40 },
    {
      y: -30,
      rotateX: 6,
      z: 40,
      ease: 'none',
      transformPerspective: 1200,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    }
  );

  cleanups.push(() => {
    tween.scrollTrigger?.kill();
    tween.kill();
  });
};

const setupCardSlide = (element, cleanups) => {
  if (element.dataset.scrollFxCards === 'true') return;
  element.dataset.scrollFxCards = 'true';

  const cards = Array.from(element.children).filter((child) => child instanceof HTMLElement);
  if (cards.length === 0) return;

  gsap.set(cards, { opacity: 0, y: 28, rotateX: 8, transformPerspective: 1000 });

  const trigger = ScrollTrigger.create({
    trigger: element,
    start: 'top 86%',
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
      });
    },
  });

  cleanups.push(() => trigger.kill());
};

export const useGlobalScrollEffects = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const appRoot = document.querySelector('.app-container');
    if (!appRoot) return undefined;

    const cleanups = [];
    let rafId = 0;

    const initEffects = () => {
      const sectionElements = appRoot.querySelectorAll(SECTION_SELECTORS);
      sectionElements.forEach((element) => setupSectionReveal(element, cleanups));

      const heroElements = appRoot.querySelectorAll(HERO_SELECTORS);
      heroElements.forEach((element) => setupHeroParallax(element, cleanups));

      const depthElements = appRoot.querySelectorAll(DEPTH_SELECTORS);
      depthElements.forEach((element) => setupDepthShift(element, cleanups));

      const cardGroups = appRoot.querySelectorAll(CARD_GROUP_SELECTORS);
      cardGroups.forEach((element) => setupCardSlide(element, cleanups));

      ScrollTrigger.refresh();
    };

    const scheduleInit = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(initEffects);
    };

    scheduleInit();

    const observer = new MutationObserver(() => {
      scheduleInit();
    });

    observer.observe(appRoot, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [location.pathname]);
};
