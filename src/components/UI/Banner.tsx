import { BookOpen, PenSquare } from 'lucide-react';

const Banner: React.FC = () => {
  return (
    <div className="relative h-[65vh] overflow-hidden bg-gradient-to-l from-[#8B4513] via-[#A0522D] to-[#CD853F]">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Animated Background Dots */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-4 left-8 w-12 h-12 bg-white rounded-full animate-pulse sm:w-16 sm:h-16"></div>
          <div className="absolute top-16 right-10 w-10 h-10 bg-amber-200 rounded-full animate-bounce sm:w-12 sm:h-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
          Share Your Knowledge, Shape the World
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-amber-100 mb-8 max-w-2xl mx-auto font-medium">
          Be a voice in the digital world. Contribute your insights, learn from others, and grow with a community that values stories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 justify-center items-center">
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 flex items-center justify-center gap-3 border border-white/30 shadow-lg transition-transform transform hover:scale-105">
            <PenSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <span className="text-white font-medium text-sm sm:text-base">Write Your Own Articles</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 flex items-center justify-center gap-3 border border-white/30 shadow-lg transition-transform transform hover:scale-105">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <span className="text-white font-medium text-sm sm:text-base">Explore Community Stories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
