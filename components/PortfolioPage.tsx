import React, { useState, useMemo, useEffect } from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import type { PortfolioItem } from '../types';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { X, Play } from 'lucide-react';

const PortfolioCard: React.FC<{ item: PortfolioItem; onClick: () => void }> = ({ item, onClick }) => {
  const renderThumbnail = () => {
    if (item.type === 'video' && item.videoUrl) {
      // Check if custom cover image exists (from imageUrl)
      // If imageUrl is different from videoUrl, it means a custom cover was set
      const hasCustomCover = item.imageUrl && item.imageUrl !== item.videoUrl;
      const youtubeMatch = item.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      
      // If it's YouTube video
      if (youtubeMatch) {
        return (
          <>
            <img 
              src={hasCustomCover ? item.imageUrl : `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`}
              alt={item.title} 
              className="w-full h-auto object-cover rounded-lg"
              onError={(e) => {
                // Fallback to YouTube thumbnail if custom image fails
                if (hasCustomCover) {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
                } else {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
                }
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 flex items-center justify-center transition-colors duration-300">
              <div className="bg-red-600 rounded-full p-4 md:p-6 transform group-hover:scale-125 transition-transform duration-300 shadow-2xl">
                <Play size={32} fill="white" className="text-white md:w-12 md:h-12 translate-x-0.5" />
              </div>
            </div>
          </>
        );
      }
      
      // For direct video, use custom cover or video first frame
      if (hasCustomCover) {
        return (
          <>
            <img 
              src={item.imageUrl}
              alt={item.title} 
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 flex items-center justify-center transition-colors duration-300">
              <div className="bg-red-600 rounded-full p-4 md:p-6 transform group-hover:scale-125 transition-transform duration-300 shadow-2xl">
                <Play size={32} fill="white" className="text-white md:w-12 md:h-12 translate-x-0.5" />
              </div>
            </div>
          </>
        );
      }
      
      return (
        <>
          <video
            src={item.videoUrl}
            className="w-full h-auto object-cover rounded-lg"
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 flex items-center justify-center transition-colors duration-300">
            <div className="bg-red-600 rounded-full p-4 md:p-6 transform group-hover:scale-125 transition-transform duration-300 shadow-2xl">
              <Play size={32} fill="white" className="text-white md:w-12 md:h-12 translate-x-0.5" />
            </div>
          </div>
        </>
      );
    }
    return <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover rounded-lg" />;
  };

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
    >
      {renderThumbnail()}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const Modal: React.FC<{ item: PortfolioItem | null; onClose: () => void }> = ({ item, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (item) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose]);

  if (!item) return null;

  // Check if video is YouTube Shorts
  const isShorts = item.type === 'video' && item.videoUrl?.includes('/shorts/');

  const renderModalContent = () => {
    if (item.type === 'video' && item.videoUrl) {
      // Support YouTube regular videos, Shorts, and youtu.be links
      const youtubeMatch = item.videoUrl.match(/(?:youtube\.com\/(?:shorts\/|(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([^"&?\/\s]{11})/);
      const isShorts = item.videoUrl.includes('/shorts/');
      
      if (youtubeMatch) {
        return (
          <div className={`${isShorts ? 'w-auto h-full' : 'w-full h-full'}`}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`}
              className={`rounded-lg ${isShorts ? 'h-full w-auto' : 'w-full h-full'}`}
              style={isShorts ? { aspectRatio: '9/16', maxHeight: '85vh' } : {}}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        );
      }
      return (
        <video
          src={item.videoUrl}
          className="max-w-full max-h-full rounded-lg"
          controls
          autoPlay
          style={{ width: 'auto', height: 'auto' }}
        />
      );
    }
    return (
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        className="max-w-full max-h-full rounded-lg" 
        style={{ width: 'auto', height: 'auto', objectFit: 'contain' }}
      />
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}} />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 bg-red-600 text-white p-2.5 rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-2xl z-10"
        aria-label="إغلاق"
      >
        <X size={22} />
      </button>
      <div 
        className="relative animate-scaleIn flex items-center justify-center"
        style={{
          maxWidth: isShorts ? '450px' : '90vw',
          maxHeight: '85vh',
          width: isShorts ? 'auto' : (item.type === 'video' ? '80vw' : 'auto'),
          height: isShorts ? '85vh' : (item.type === 'video' ? '80vh' : 'auto')
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderModalContent()}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/60 px-3 py-1.5 rounded-full">
        اضغط ESC أو خارج النافذة للإغلاق
      </div>
    </div>
  );
};

const PortfolioPage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [portfolioData, setPortfolioData] = useState<{ [category: string]: string[] }>({});
  const [allItems, setAllItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'siteSettings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().portfolioCategories) {
          const categories = docSnap.data().portfolioCategories;
          setPortfolioData(categories);
          
          // Convert to PortfolioItem format
          const items: PortfolioItem[] = [];
          Object.entries(categories).forEach(([category, media]: [string, any]) => {
            if (Array.isArray(media)) {
              media.forEach((item: any) => {
                // Support both old format (string) and new format (object with url and type)
                if (typeof item === 'string') {
                  items.push({
                    id: items.length + 1,
                    title: category,
                    category: category,
                    imageUrl: item,
                    type: 'image'
                  });
                } else if (item.url) {
                  items.push({
                    id: items.length + 1,
                    title: category,
                    category: category,
                    imageUrl: item.coverImage || item.url, // استخدام صورة الغلاف إذا كانت موجودة
                    videoUrl: item.type === 'video' ? item.url : undefined,
                    type: item.type || 'image'
                  });
                }
              });
            }
          });
          if (items.length > 0) {
            setAllItems(items);
          } else {
            // إذا لم توجد بيانات في Firestore، استخدم البيانات التجريبية
            setAllItems(PORTFOLIO_ITEMS);
          }
        } else {
          // إذا لم يوجد المستند، استخدم البيانات التجريبية
          setAllItems(PORTFOLIO_ITEMS);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
        // في حالة الخطأ، استخدم البيانات التجريبية
        setAllItems(PORTFOLIO_ITEMS);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolioData();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(allItems.map((item) => item.category))], [allItems]);

  const filteredItems = useMemo(
    () => (filter === 'All' ? allItems : allItems.filter((item) => item.category === filter)),
    [filter, allItems]
  );

  if (loading) {
    return (
      <section id="portfolio" className="py-20 pt-32 min-h-screen relative text-white bg-gradient-to-br from-red-700 to-black flex items-center justify-center" style={{ scrollMarginTop: '80px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-300 mx-auto mb-4"></div>
          <p className="text-xl">جاري تحميل الأعمال...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 pt-32 min-h-screen relative text-white bg-gradient-to-br from-red-700 to-black" style={{ scrollMarginTop: '80px' }}>
      {/* Red to black gradient background */}
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 text-white">
          Our <span className="text-red-300">Portfolio</span>
        </h2>
        <div className="w-24 h-1 bg-red-300 mx-auto mb-12"></div>

        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 glass-card ${
                filter === category ? 'bg-red-500 text-white shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-red-200 mb-4">لا توجد أعمال في هذه الفئة</p>
            <p className="text-gray-400">يمكنك إضافة أعمال جديدة من لوحة التحكم</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="break-inside-avoid mb-4">
                <PortfolioCard 
                  item={item} 
                  onClick={() => setSelectedItem(item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};

export default PortfolioPage;
