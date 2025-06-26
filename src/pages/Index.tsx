
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, ExternalLink, Sparkles, Heart, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-indigo-400/40 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-12 mb-8 animate-fade-in hover:shadow-3xl transition-all duration-500">
          <div className="relative mb-8">
            <div className="relative inline-block">
              <CalendarIcon className="w-24 h-24 text-blue-500 mx-auto drop-shadow-lg animate-pulse" />
              <div className="absolute -top-3 -right-3 animate-spin">
                <Sparkles className="w-10 h-10 text-yellow-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-bounce">
                <Zap className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Welcome to Avensora's
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-8">
            Digital Media Hub
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
            Where creativity meets strategy. Your campaigns, your calendar, your momentum.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-200/50">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
              ✨ Reach out to your avensora contact for login link!
            </p>
          </div>
        </div>

        {/* Footer section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <p className="text-lg text-gray-600 mb-6">
            Empowering brands through strategic digital storytelling
          </p>
          
          <div className="pt-6 border-t border-gray-200/50">
            <p className="text-lg text-gray-600">
              🔗 <a 
                href="https://avensora.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-4 hover:decoration-blue-600 transition-all duration-300"
              >
                Visit Avensora.in
              </a> — Building brands, one campaign at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
