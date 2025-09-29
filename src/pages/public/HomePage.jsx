import React, { useState, useEffect } from 'react';

export default function GlobalEducationCenter() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e, targetId) => {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Add event listeners for smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        if (targetId) {
          handleSmoothScroll(e, targetId);
        }
      });
    });

    // Add scroll event listener for section tracking
    const handleScroll = () => {
      const sections = ['fanlar', 'biz-haqimizda', 'aloqa'];
      const scrollPosition = window.scrollY + 100;
      
      // Check if we're at the top of the page
      if (scrollPosition < 300) {
        setActiveSection('home');
        return;
      }
      
      // Check which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Call once to set initial state
    handleScroll();

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const subjects = [
    { name: 'Matematika', description: 'Algebra, geometriya va analiz', icon: 'fas fa-calculator', color: 'blue' },
    { name: 'Fizika', description: 'Mexanika, optika va elektr', icon: 'fas fa-atom', color: 'red' },
    { name: 'Kimyo', description: 'Organik va noorganik kimyo', icon: 'fas fa-flask', color: 'blue' },
    { name: 'Biologiya', description: 'Botanika, zoologiya va genetika', icon: 'fas fa-dna', color: 'red' },
    { name: 'Ingliz tili', description: 'IELTS va CEFR standartlari', icon: 'fas fa-language', color: 'blue' },
    { name: 'Adabiyot', description: "O'zbek va jahon adabiyoti", icon: 'fas fa-book', color: 'red' },
    { name: 'Geografiya', description: 'Fizik va iqtisodiy geografiya', icon: 'fas fa-globe', color: 'blue' },
    { name: 'Tarix', description: "O'zbekiston va jahon tarixi", icon: 'fas fa-landmark', color: 'red' },
    { name: 'Informatika', description: 'Dasturlash va IT texnologiyalar', icon: 'fas fa-laptop-code', color: 'blue' }
  ];



  return (
    <div className="font-sans bg-gray-50 md:pb-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Custom Styles */}
      <style jsx>{`
        .logo-blue { color: #1a365d; }
        .bg-logo-blue { background-color: #1a365d; }
        .bg-logo-blue-10 { background-color: rgba(26, 54, 93, 0.1); }
        .border-logo-blue { border-color: #1a365d; }
        .logo-blue-light { color: #2d5aa0; }
        .bg-logo-blue-light { background-color: #2d5aa0; }
        .logo-red { color: #e53e3e; }
        .bg-logo-red { background-color: #e53e3e; }
        .logo-red-light { color: #fc8181; }
        .bg-logo-red-light { background-color: #fc8181; }
        .from-logo-blue { background-image: linear-gradient(to bottom right, #1a365d, var(--tw-gradient-to, rgba(26, 54, 93, 0))); }
        .to-logo-blue-light { --tw-gradient-to: #2d5aa0; }
        .text-logo-blue { color: #1a365d; }
        .text-logo-red { color: #e53e3e; }
        .text-logo-red-light { color: #fc8181; }
        .hover\\:text-logo-blue:hover { color: #1a365d; }
        .hover\\:text-logo-red:hover { color: #e53e3e; }
        .hover\\:text-logo-red-light:hover { color: #fc8181; }
        .hover\\:bg-logo-red-light:hover { background-color: #fc8181; }
        .border-t-logo-blue { border-top-color: #1a365d; }
        .border-t-logo-red { border-top-color: #e53e3e; }
      `}</style>

      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
  

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-logo-blue to-logo-blue-light text-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-relaxed">
                <span className="block">Kelajagingizni</span>
                <span className="block text-logo-red-light mt-2">Bizda</span>
                <span className="block mt-2">Quring</span>
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-blue-100">
                Professional o'qituvchilar bilan sifatli ta'lim va yuqori natijalar kafolati
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-logo-red text-white px-6 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-logo-red-light transition-colors shadow-lg">
                  Ro'yxatdan o'tish
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-logo-blue transition-colors">
                  Batafsil ma'lumot
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                    <i className="fas fa-trophy text-logo-red text-4xl mb-3"></i>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm">Muvaffaqiyatli o'quvchilar</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                    <i className="fas fa-medal text-logo-red text-4xl mb-3"></i>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm">Yuqori natijalar</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-full h-48 bg-gradient-to-r from-logo-red to-logo-red-light rounded-xl flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <i className="fas fa-graduation-cap text-6xl text-white mb-4"></i>
                      <h4 className="text-xl font-bold text-white">Ta'lim - Kelajak Kaliti</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="fanlar" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-logo-blue mb-4">Bizning Fanlarimiz</h3>
            <p className="text-xl text-gray-600">Har bir fan bo'yicha professional ta'lim</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-t-4 ${subject.color === 'blue' ? 'border-t-logo-blue' : 'border-t-logo-red'}`}>
                <div className="text-center">
                  <div className={`w-16 h-16 ${subject.color === 'blue' ? 'bg-logo-blue' : 'bg-logo-red'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${subject.icon} text-white text-2xl`}></i>
                  </div>
                  <h4 className="text-xl font-bold text-logo-blue mb-2">{subject.name}</h4>
                  <p className="text-gray-600">{subject.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button className="bg-logo-red text-white px-8 py-3 sm:px-12 sm:py-4 rounded-lg text-lg sm:text-xl font-semibold hover:bg-logo-red-light transition-colors shadow-lg">
              Bepul konsultatsiya olish
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="biz-haqimizda" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-logo-blue mb-6">Biz Haqimizda</h3>
              <div className="space-y-4 text-lg text-gray-700">
                <p>Global O'quv Markazi - zamonaviy ta'lim usullarini qo'llagan holda yuqori sifatli bilim beradigan o'quv muassasasi.</p>
                <p>Bizning maqsadimiz har bir o'quvchining individual qobiliyatlarini rivojlantirish va ularga kelajakda muvaffaqiyat qozonish uchun zarur bilim va ko'nikmalarni berishdir.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-logo-blue rounded-lg text-white shadow-lg">
                  <div className="text-3xl font-bold">5+</div>
                  <div className="text-sm">Yillik tajriba</div>
                </div>
                <div className="text-center p-6 bg-logo-red rounded-lg text-white shadow-lg">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-sm">Professional o'qituvchi</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg">
                <div className="w-full h-64 bg-gradient-to-br from-logo-blue-light to-logo-blue rounded-lg shadow-md flex items-center justify-center">
                  <div className="text-center text-white">
                    <i className="fas fa-chalkboard-teacher text-6xl mb-4"></i>
                    <h4 className="text-xl font-bold">Zamonaviy Ta'lim Usullari</h4>
                    <p className="text-blue-100 mt-2">Eng so'nggi texnologiyalar bilan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="aloqa" className="py-20 bg-gradient-to-br from-logo-blue to-logo-blue-light text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Biz bilan bog'laning</h3>
            <p className="text-xl text-blue-100">Savollaringiz bo'lsa, biz bilan bog'laning</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-phone text-2xl text-logo-red"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Telefon raqami</h4>
              <p className="text-blue-100">+99899-103-33-47</p>
              <p className="text-blue-100">+99897-075-45-55</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fab fa-telegram text-2xl text-logo-red"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Telegram</h4>
              <p className="text-blue-100">@global_soktari</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fab fa-instagram text-2xl text-logo-red"></i>
              </div>
              <h4 className="text-xl font-semibold mb-2">Instagram</h4>
              <p className="text-blue-100">@global_soktari</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-logo-red text-white px-8 py-3 sm:px-12 sm:py-4 rounded-lg text-lg sm:text-xl font-semibold hover:bg-logo-red-light transition-colors shadow-lg">
              Bepul konsultatsiya olish
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}