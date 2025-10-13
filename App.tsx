import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/Features';
import Services from './components/Testimonials';
import { Portfolio, Clients } from './components/Clients';
import Vision from './components/Countdown';
import Contact from './components/ContactForm';
import Footer from './components/Footer';
import PortfolioPage from './components/PortfolioPage';

const App: React.FC = () => {
  const [page, setPage] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash);
      window.scrollTo(0, 0); // Scroll to top on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showHomePage = !page || page === '#home' || page.startsWith('#about') || page.startsWith('#services') || page.startsWith('#vision') || page.startsWith('#contact');

  return (
    <div className="overflow-x-hidden">
      <Header />
      <main>
        {page === '#portfolio' ? (
          <PortfolioPage />
        ) : (
          <>
            <Hero />
            <About />
            <Services />
            <Portfolio />
            <Clients />
            <Vision />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;