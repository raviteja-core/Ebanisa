import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location]);
};

export const useScrollProgressBar = () => {
  useEffect(() => {
    let progressBar = document.getElementById('scroll-progress-bar');
    
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress-bar';
      progressBar.style.cssText = `
        position: fixed;
        top: 44px;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ffcc00, #ffd633, #ffcc00);
        background-size: 200% 200%;
        width: 0%;
        z-index: 999;
        box-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
      `;
      document.body.appendChild(progressBar);
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      if (progressBar) {
        progressBar.style.width = scrolled + '%';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
