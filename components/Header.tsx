import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Observe the portfolio section to force white header when portfolio is visible
  useEffect(() => {
    const portfolioEl = document.getElementById('portfolio');
    if (!portfolioEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => setIsPortfolioVisible(entry.isIntersecting));
      },
      { root: null, threshold: 0.2 }
    );

    observer.observe(portfolioEl);
    return () => observer.disconnect();
  }, []);
  
  const hasWhiteBg = isScrolled || isOpen || isPortfolioVisible;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's an in-page anchor (starts with #) perform programmatic smooth scroll
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);

      // No special cases: treat all hash links as in-page anchors and scroll to them.

      const target = document.getElementById(id);
      if (target) {
        // Use scrollIntoView with smooth behavior. index.html already includes `scroll-smooth` class,
        // but this guarantees smooth scrolling across browsers.
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: if the target isn't present (maybe not mounted), set the hash so the browser
        // will try to navigate. Also retry once after a short delay to attempt programmatic scroll.
        try {
          window.location.hash = id;
        } catch (err) {
          // ignore
        }
        setTimeout(() => {
          const retry = document.getElementById(id);
          if (retry) retry.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }

    // Close the mobile menu if it's open
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${hasWhiteBg ? 'bg-white/90 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#home">
            <img 
              src="https://i.postimg.cc/0yvTRQ22/mention-logo-wihte.png" 
              alt="Mention Studio Logo"
              className={`h-8 w-auto transition-all duration-300 ${hasWhiteBg ? 'invert' : ''}`}
            />
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`transition-colors font-medium ${hasWhiteBg ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-red-200'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`${hasWhiteBg ? 'text-gray-800' : 'text-white'} focus:outline-none`}>
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
          </div>
        </div>
        <nav className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
            <ul className="flex flex-col items-center space-y-4 py-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-gray-700 hover:text-red-600 transition-colors font-medium text-lg">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;