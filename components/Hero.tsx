import React from 'react';
import backgroundImage from '@/src/assets/Copilot_20251014_062548.png';

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center text-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* تدرج أسود في الأعلى */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-0"></div>
      
      {/* تدرج أسود في الأسفل */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-0"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div>
          <h1 className="text-[6vw] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg whitespace-nowrap">
            Mention it — Make it happen.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 drop-shadow-md">
            Your ideal partner in digital marketing, media production, and integrated technology solutions.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const id = 'contact';
              const el = document.getElementById(id);
              const header = document.querySelector('header');
              const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
              if (el) {
                const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8; // small gap
                window.scrollTo({ top, behavior: 'smooth' });
                el.setAttribute('tabindex', '-1');
                (el as HTMLElement).focus({ preventScroll: true });
              } else {
                try { window.location.hash = id; } catch (err) {}
              }
            }}
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;