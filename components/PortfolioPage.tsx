import React, { useState, useMemo } from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import type { PortfolioItem } from '../types';

const PortfolioCard: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg aspect-square shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
      {item.type === 'video' ? (
        <video
          src={item.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
      )}
      {/* overlay removed - show image/video only */}
    </div>
  );
};

const PortfolioPage: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(PORTFOLIO_ITEMS.map((item) => item.category))], []);

  const filteredItems = useMemo(
    () => (filter === 'All' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((item) => item.category === filter)),
    [filter]
  );

  return (
    <section id="portfolio" className="py-20 pt-32 min-h-screen relative text-white bg-gradient-to-br from-red-600 via-red-800 to-black" style={{ scrollMarginTop: '80px' }}>
      {/* Red to black gradient background */}
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 text-white">
          Our <span className="text-red-300">Portfolio</span>
        </h2>
        <div className="w-24 h-1 bg-red-400 mx-auto mb-12"></div>

        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 ${
                filter === category ? 'bg-red-500 text-white shadow-lg' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioPage;
