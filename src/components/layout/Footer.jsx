const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <img 
                  src="/logo.png" 
                  alt="Global O'quv Markazi Logo" 
                  className="w-8 sm:w-12 h-8 sm:h-12 rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-8 sm:w-12 h-8 sm:h-12 bg-logo-blue rounded-full flex items-center justify-center" 
                  style={{display: 'none'}}
                >
                  <span className="text-white font-bold text-sm sm:text-lg">G</span>
                </div>
                <div>
                  <h4 className="text-sm sm:text-lg font-bold text-logo-blue">GLOBAL</h4>
                  <p className="text-xs sm:text-sm text-gray-400">O'QUV MARKAZI</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">Sifatli ta'lim va professional rivojlanish markazi</p>
            </div>
            
            <div>
              <h5 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 text-logo-blue">Fanlar</h5>
              <ul className="space-y-1 sm:space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">Matematika</a></li>
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">Fizika</a></li>
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">Kimyo</a></li>
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">Ingliz tili</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 text-logo-blue">Havolalar</h5>
              <ul className="space-y-1 sm:space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">Biz haqimizda</a></li>
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">O'qituvchilar</a></li>
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">Natijalar</a></li>
                <li><a href="#" className="hover:text-logo-red transition-colors text-xs sm:text-sm">Bog'lanish</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 text-logo-blue">Ijtimoiy tarmoqlar</h5>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="text-lg sm:text-2xl text-logo-red hover:text-logo-red-light transition-colors">
                  <i className="fab fa-telegram"></i>
                </a>
                <a href="#" className="text-lg sm:text-2xl text-logo-red hover:text-logo-red-light transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-lg sm:text-2xl text-logo-red hover:text-logo-red-light transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">&copy; 2024 Global O'quv Markazi. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-4 py-1">
          <a href="#" className="flex flex-col items-center py-1.5 px-1 text-logo-blue">
            <div className="w-7 h-7 bg-logo-blue/10 rounded-lg flex items-center justify-center mb-0.5">
              <i className="fas fa-home text-logo-blue text-xs"></i>
            </div>
            <span className="text-xs font-medium">Asosiy</span>
          </a>
          <a href="/test-results" className="flex flex-col items-center py-1.5 px-1 text-gray-500 hover:text-logo-blue transition-colors">
            <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center mb-0.5 hover:bg-logo-blue/10">
              <i className="fas fa-chart-line text-xs"></i>
            </div>
            <span className="text-xs font-medium">Test natijalari</span>
          </a>
          <a href="/achievements" className="flex flex-col items-center py-1.5 px-1 text-gray-500 hover:text-logo-blue transition-colors">
            <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center mb-0.5 hover:bg-logo-blue/10">
              <i className="fas fa-trophy text-xs"></i>
            </div>
            <span className="text-xs font-medium">Yutuqlar</span>
          </a>
          <a href="/graduates" className="flex flex-col items-center py-1.5 px-1 text-gray-500 hover:text-logo-blue transition-colors">
            <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center mb-0.5 hover:bg-logo-blue/10">
              <i className="fas fa-user-graduate text-xs"></i>
            </div>
            <span className="text-xs font-medium">Talabalarimiz</span>
          </a>
        </div>
      </nav>
    </>
  );
};

export default Footer;