import React, { useState, useEffect } from 'react';
import { PORTFOLIO_ITEMS, CLIENTS } from '../constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AnimatedImage: React.FC<{ imageUrls: string[]; alt: string; interval?: number; className?: string; imgClassName?: string }> = ({ imageUrls, alt, interval = 3000, className, imgClassName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, interval);

    return () => clearInterval(timer);
  }, [imageUrls.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`${alt} ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imgClassName} ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const [featuredWork, setFeaturedWork] = useState<string[]>([]);
  const allPortfolioUrls = featuredWork.length > 0 ? featuredWork : PORTFOLIO_ITEMS.map(item => item.imageUrl);

  useEffect(() => {
    const loadFeaturedWork = async () => {
      try {
        const docRef = doc(db, 'siteSettings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().featuredWork) {
          const featured = docSnap.data().featuredWork;
          if (featured.length > 0) {
            setFeaturedWork(featured);
          }
        }
      } catch (error) {
        console.error('Error loading featured work:', error);
      }
    };
    loadFeaturedWork();
  }, []);

  const getImageSet = (offset: number) => {
      return [...allPortfolioUrls.slice(offset), ...allPortfolioUrls.slice(0, offset)];
  };
  
  const handlePortfolioClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = 'portfolio';
    window.scrollTo(0, 0);
  };

  return (
    <section id="work" className="py-20 text-white relative">
      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-center mb-4">
                Our <span className="text-red-300">Work</span>
            </h2>
            <div className="w-24 h-1 bg-red-300 mx-auto mb-12"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h3 className="text-2xl font-bold mb-4">A Glimpse of Our Work</h3>
                <p className="text-red-100 mb-6">We've had the privilege of collaborating with a diverse range of clients to create impactful digital experiences. Here's a small sample of our portfolio.</p>
                <a href="#portfolio" onClick={handlePortfolioClick} className="inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    View Full Portfolio
                </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <AnimatedImage imageUrls={getImageSet(0)} alt="Portfolio sample" className="rounded-lg aspect-square" imgClassName="rounded-lg" />
                <AnimatedImage imageUrls={getImageSet(1)} alt="Portfolio sample" className="rounded-lg aspect-square" imgClassName="rounded-lg" />
                <AnimatedImage imageUrls={getImageSet(2)} alt="Portfolio sample" className="rounded-lg aspect-square" imgClassName="rounded-lg" />
                <AnimatedImage imageUrls={getImageSet(3)} alt="Portfolio sample" className="rounded-lg aspect-square" imgClassName="rounded-lg" />
            </div>
        </div>
      </div>
    </section>
  );
};

export const Clients: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const [clientLogos, setClientLogos] = useState<string[]>(CLIENTS);

  useEffect(() => {
    const loadClientLogos = async () => {
      try {
        const docRef = doc(db, 'siteSettings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().clientLogos) {
          const logos = docSnap.data().clientLogos;
          if (logos.length > 0) {
            setClientLogos(logos);
          }
        }
      } catch (error) {
        console.error('Error loading client logos:', error);
      }
    };
    loadClientLogos();
  }, []);

  return (
    <section id="clients" className="py-20 text-white relative overflow-hidden">
      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-center mb-4">
                Our <span className="text-red-300">Clients</span>
            </h2>
            <div className="w-24 h-1 bg-red-300 mx-auto mb-12"></div>
        </div>

        <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold mb-4 transition-opacity duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Trusted By</h3>
            <p className={`text-red-100 max-w-2xl mx-auto transition-opacity duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                We're proud to partner with leading brands and organizations who trust us to bring their vision to life.
            </p>
        </div>

        {/* شريط التمرير اللانهائي */}
        <div className="relative">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}} />
          
          <div className="flex gap-8 animate-scroll">
            {/* المجموعة الأولى */}
            {clientLogos.map((logoUrl, index) => (
              <div key={`first-${index}`} className="glass-card rounded-2xl flex-shrink-0 w-48 h-32 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <img src={logoUrl} alt={`Client ${index + 1}`} className="w-full h-full object-cover transition-all duration-300" />
              </div>
            ))}
            {/* المجموعة الثانية (للتكرار اللانهائي) */}
            {clientLogos.map((logoUrl, index) => (
              <div key={`second-${index}`} className="glass-card rounded-2xl flex-shrink-0 w-48 h-32 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <img src={logoUrl} alt={`Client ${index + 1}`} className="w-full h-full object-cover transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
