import React, { useState, useEffect } from 'react';
import { achievementsApi } from '../../services/api';
import ZoomableImage from '../../components/ui/ZoomableImage'; // Import ZoomableImage component

export default function GlobalAchievements() {
  const [activeNavItem, setActiveNavItem] = useState('Yutuqlar');
  const [activeFilter, setActiveFilter] = useState('Barcha sertifikatlar');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for zoomable image
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState('');

  // Open zoom modal
  const openZoomModal = (imgSrc) => {
    setZoomedImageSrc(imgSrc);
    setIsZoomOpen(true);
  };

  // Close zoom modal
  const closeZoomModal = () => {
    setIsZoomOpen(false);
    setZoomedImageSrc('');
  };

  // Fetch achievements data from MongoDB
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Yutuqlarni yuklash boshlandi...');
        const response = await achievementsApi.getAll({ published: 'true' });
        console.log('✅ Yutuqlar muvaffaqiyatli yuklandi:', response);
        
        // Check if response has data property
        const achievementsData = response.data?.data || response.data || [];
        console.log('📊 Yutuqlar ma\'lumotlari:', achievementsData);
        setAchievements(achievementsData);
      } catch (error) {
        console.error('❌ Yutuqlarni yuklashda xatolik:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError(`Ma'lumotlarni yuklashda xatolik yuz berdi: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, []);

  // Helper function to check if achievement is recent (within 24 hours)
  const isRecentAchievement = (createdAtString) => {
    try {
      const createdDate = new Date(createdAtString);
      if (isNaN(createdDate.getTime())) return false;
      
      const now = new Date();
      const diffTime = Math.abs(now - createdDate);
      const diffHours = diffTime / (1000 * 60 * 60);
      return diffHours <= 24;
    } catch (error) {
      return false;
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Sana noma\'lum';
      return date.getFullYear() + '-yil';
    } catch (error) {
      return 'Sana noma\'lum';
    }
  };

  // Create filter categories based on achievement titles
  const getUniqueCategories = () => {
    const titles = Array.from(new Set(achievements.map(item => item.title.toLowerCase())));
    return ['Barcha sertifikatlar', 'Yangi', ...titles.map(title => 
      title.charAt(0).toUpperCase() + title.slice(1)
    )];
  };

  const filters = getUniqueCategories();

  // Filter achievements based on active filter
  const filteredAchievements = achievements.filter(achievement => {
    if (activeFilter === 'Barcha sertifikatlar') {
      return true;
    } else if (activeFilter === 'Yangi') {
      return isRecentAchievement(achievement.createdAt);
    } else {
      return achievement.title.toLowerCase() === activeFilter.toLowerCase();
    }
  });

  // Handle filter click
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };
  // Bottom navigation items
  const bottomNavItems = [
    { name: 'Asosiy', icon: 'fas fa-home', href: '#' },
    { name: 'Test natijalari', icon: 'fas fa-chart-line', href: '#test-natijalari' },
    { name: 'Yutuqlar', icon: 'fas fa-trophy', href: '#yutuqlar' },
    { name: 'Talabalarimiz', icon: 'fas fa-user-graduate', href: '#talabalarimiz' }
  ];

  const handleBottomNavClick = (navItem) => {
    setActiveNavItem(navItem.name);
  };

  return (
    <div className="font-sans bg-gray-50 pb-16 md:pb-0">
      <style jsx>{`
        .scrollable-filters {
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        .scrollable-filters::-webkit-scrollbar {
          display: none; /* WebKit */
        }
      `}</style>

      {/* Filter Section - Navigation Style with Horizontal Scroll */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="scrollable-filters">
            <div className="flex gap-8 min-w-max">
              {/* Certificate Type Categories */}
              <div className="flex gap-6 min-w-max">
                {filters.map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`hover:text-blue-800 hover:border-b-2 hover:border-blue-800 pb-2 font-medium transition-colors whitespace-nowrap ${
                      activeFilter === filter
                        ? 'text-blue-800 border-b-2 border-blue-800'
                        : 'text-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Yutuqlar yuklanmoqda...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">Xatolik yuz berdi</h3>
              <p className="text-gray-400">{error}</p>
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-gray-400 text-xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">Yutuqlar topilmadi</h3>
              <p className="text-gray-400">Tanlangan kategoriyada yutuqlar mavjud emas</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <div key={achievement._id} className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="w-full h-60 bg-gray-50 overflow-hidden">
                      <ZoomableImage
                        src={achievement.imageUrl ? `http://localhost:5000${achievement.imageUrl}` : '/default-certificate.jpg'} 
                        alt={achievement.title} 
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {achievement.score || achievement.level || 'N/A'}
                    </div>
                    {isRecentAchievement(achievement.createdAt) && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        YANGI
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-blue-800">{achievement.title}</h3>
                      <div className="text-sm text-gray-500">{formatDate(achievement.achievementDate || achievement.createdAt)}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <i className="fas fa-user text-blue-800 mr-3"></i>
                        <div>
                          <div className="font-semibold text-gray-800">{achievement.studentName}</div>
                          <div className="text-sm text-gray-600">O'quvchi</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <i className="fas fa-school text-blue-800 mr-3"></i>
                        <div className="text-gray-700">{achievement.school || "Maktab ko'rsatilmagan"}</div>
                      </div>
                      
                      <div className="flex items-center">
                        <i className="fas fa-calendar text-blue-800 mr-3"></i>
                        <div className="text-gray-700">{formatDate(achievement.achievementDate || achievement.createdAt)}</div>
                      </div>
                      
                      {achievement.description && (
                        <div className="flex items-start mt-3">
                          <i className="fas fa-info-circle text-blue-800 mr-3 mt-1"></i>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 mb-4">Yutuqlar Statistikasi</h3>
            <p className="text-xl text-gray-600">O'quvchilarimizning erishgan natijalari</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-blue-800">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-certificate text-white text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-blue-800 mb-2">{achievements.length}</div>
              <div className="text-gray-600">Jami sertifikatlar</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-green-500">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-blue-800 mb-2">
                {achievements.filter(a => a.title && a.title.toLowerCase().includes('ielts')).length}
              </div>
              <div className="text-gray-600">IELTS natijalari</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-globe text-white text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-blue-800 mb-2">
                {achievements.filter(a => a.title && (a.title.toLowerCase().includes('cefr') || a.title.toLowerCase().includes('toefl'))).length}
              </div>
              <div className="text-gray-600">CEFR/TOEFL natijalari</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-t-4 border-purple-500">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-white text-2xl"></i>
              </div>
              <div className="text-3xl font-bold text-blue-800 mb-2">
                {achievements.filter(a => a.title && !a.title.toLowerCase().includes('ielts') && !a.title.toLowerCase().includes('cefr') && !a.title.toLowerCase().includes('toefl')).length}
              </div>
              <div className="text-gray-600">Boshqa sertifikatlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Zoom Modal - Using the same implementation as ZoomableImage component */}
      <ZoomableImage
        src={zoomedImageSrc}
        alt="Zoomed certificate"
        isOpen={isZoomOpen}
        onClose={closeZoomModal}
      />

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-4 py-1">
          {bottomNavItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleBottomNavClick(item);
              }}
              className={`flex flex-col items-center py-1.5 px-1 transition-colors ${
                activeNavItem === item.name ? 'text-blue-900' : 'text-gray-500 hover:text-blue-900'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-0.5 ${
                activeNavItem === item.name ? 'bg-blue-900/10' : 'bg-gray-100 hover:bg-blue-900/10'
              }`}>
                <i className={`${item.icon} text-sm`}></i>
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}