import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testResultsApi, subjectsApi } from '../../services/api';

export default function TestResultsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Barcha fanlar');
  const [testResults, setTestResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredFilter, setHoveredFilter] = useState(null);

  // Helper functions
  const getSubjectIcon = (subjectName) => {
    const iconMap = {
      'Matematika': 'fas fa-calculator',
      'Fizika': 'fas fa-atom',
      'Kimyo': 'fas fa-flask',
      'Ingliz tili': 'fas fa-language',
      'Biologiya': 'fas fa-dna',
      'Geografiya': 'fas fa-globe',
      'Tarix': 'fas fa-landmark',
      'Adabiyot': 'fas fa-book',
      'Informatika': 'fas fa-computer',
      'Geometriya': 'fas fa-shapes'
    };
    return iconMap[subjectName] || 'fas fa-book';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Sana noma\'lum';
      
      const options = { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      return date.toLocaleDateString('uz-UZ', options);
    } catch (error) {
      return 'Sana noma\'lum';
    }
  };

  // Helper function to check if test is recent (within 1 day - 24 hours)
  const isRecentTest = (createdAtString) => {
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

  // Fetch data from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Test natijalari va fanlarni yuklash boshlandi...');
        const [testResultsResponse, subjectsResponse] = await Promise.all([
          testResultsApi.getAll({ published: 'true' }),
          subjectsApi.getAll()
        ]);
        
        console.log('✅ Test results response:', testResultsResponse);
        console.log('✅ Subjects response:', subjectsResponse);
        
        // Handle nested data structure
        const testResultsData = testResultsResponse.data?.data || testResultsResponse.data || [];
        const subjectsData = subjectsResponse.data?.data || subjectsResponse.data || [];
        
        console.log('📊 Test results data:', testResultsData);
        console.log('📊 Subjects data:', subjectsData);
        
        setTestResults(testResultsData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('❌ Ma\'lumotlarni yuklashda xatolik:', error);
        console.error('Error response:', error.response);
        setError(`Ma'lumotlarni yuklashda xatolik yuz berdi: ${error.message}. Iltimos, qayta urinib ko'ring.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Convert test results to display format
  const formattedTestResults = Array.isArray(testResults) ? testResults.map(testResult => {
    try {
      console.log('Processing test result:', testResult);
      const subject = testResult.group?.subject;
      if (!subject) {
        console.log('⚠️ No subject found for test result:', testResult._id);
        return null;
      }
      
      const formatted = {
        id: testResult._id,
        name: subject.name,
        teacher: subject.teacherName || 'Ustoz ko\'rsatilmagan',
        icon: getSubjectIcon(subject.name),
        group: testResult.group?.name || 'Guruh',
        date: formatDate(testResult.testDate),
        average: testResult.averageScore || 0,
        attended: testResult.totalStudents || 0,
        passed: testResult.results?.filter(r => r.percentage >= 60).length || 0,
        retry: testResult.results?.filter(r => r.percentage < 60).length || 0,
        isNew: isRecentTest(testResult.createdAt),
        grade: testResult.group?.name?.match(/\d+/)?.[0] || '9'
      };
      console.log('Formatted test result:', formatted);
      return formatted;
    } catch (error) {
      console.error('Error formatting test result:', error, testResult);
      return null;
    }
  }).filter(Boolean).sort((a, b) => {
    const aCreatedAt = testResults.find(tr => tr._id === a.id)?.createdAt;
    const bCreatedAt = testResults.find(tr => tr._id === b.id)?.createdAt;
    return new Date(bCreatedAt) - new Date(aCreatedAt);
  }) : [];

  // Create filters based on available subjects and add special filters
  const uniqueSubjects = Array.from(new Set(formattedTestResults.map(item => item.name)));
  const filters = ['Barcha fanlar', 'Yangi natijalari', ...uniqueSubjects];

  // Filter and search functionality
  const filteredResults = formattedTestResults.filter(result => {
    // Filter logic
    let filterMatch = true;
    if (activeFilter === 'Barcha fanlar') {
      filterMatch = true; // Show all
    } else if (activeFilter === 'Yangi natijalari') {
      filterMatch = result.isNew; // Show only new results
    } else {
      filterMatch = result.name === activeFilter; // Show specific subject
    }

    // Search logic
    let searchMatch = true;
    if (searchTerm) {
      searchMatch = 
        result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return filterMatch && searchMatch;
  });

  // Handle view test result details
  const handleViewDetails = (result) => {
    navigate(`/test-results/${result.id}`);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Calculate summary statistics
  const totalSubjects = formattedTestResults.length;
  const totalStudents = formattedTestResults.reduce((sum, result) => sum + result.attended, 0);
  const overallAverage = totalSubjects > 0 
    ? (formattedTestResults.reduce((sum, result) => sum + result.average, 0) / totalSubjects).toFixed(1)
    : '0.0';
  const highestScore = totalSubjects > 0
    ? Math.max(...formattedTestResults.map(result => result.average)).toFixed(1)
    : '0.0';

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Test natijalari yuklanmoqda...</h3>
          <p className="text-gray-600">Iltimos, biroz kuting</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Xatolik yuz berdi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔄 Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <style jsx>{`
        .card {
          transition: all 0.3s ease;
          background: white;
          border: 1px solid #E1E8ED;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(74, 105, 189, 0.15);
          border-color: #4A69BD;
        }
        .primary-bg { 
          background: linear-gradient(135deg, #4A69BD, #3c5aa6);
        }
        .primary-bg:hover { 
          background: linear-gradient(135deg, #3c5aa6, #2f4788);
        }
        .success-text { color: #27AE60; }
        .stat-item {
          transition: all 0.2s ease;
        }
        .stat-item:hover {
          transform: scale(1.05);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Filter Section with hr line */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <hr className="border-t border-gray-200" />
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-8 px-4 py-4 min-w-max">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  onMouseEnter={() => setHoveredFilter(filter)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative transition-all duration-300 ease-out ${
                    activeFilter === filter
                      ? 'text-blue-900'
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  {filter}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 transition-all duration-300 ease-cubic-bezier-custom ${
                      activeFilter === filter || hoveredFilter === filter 
                        ? 'opacity-100 scale-x-100' 
                        : 'opacity-0 scale-x-0'
                    }`}
                    style={{
                      transformOrigin: 'center',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Fan yoki o'qituvchi qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all shadow-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Cards */}
      <section className="pt-7 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <div key={result.id} className="card rounded-xl p-4 shadow-sm">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <i className={`${result.icon} text-blue-800 text-lg`}></i>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{result.name}</h3>
                      <p className="text-gray-500 text-sm">{result.teacher}</p>
                    </div>
                  </div>
                  {result.isNew && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">YANGI</span>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="space-y-3">
                  {/* Group and Date */}
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Guruh:</span>
                      <span className="font-medium text-gray-800 ml-1">{result.group}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{result.date}</span>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center py-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold success-text">{result.average.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">O'rtacha</div>
                    </div>
                    
                    <div className="flex space-x-4 text-center">
                      <div>
                        <div className="text-sm font-bold text-gray-700">{result.attended}</div>
                        <div className="text-xs text-gray-500">Qatnashdi</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-700">{result.passed}</div>
                        <div className="text-xs text-gray-500">Muvaffaq</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-700">{result.retry}</div>
                        <div className="text-xs text-gray-500">Takrorlash</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Button */}
                  <button
                    onClick={() => handleViewDetails(result)}
                    className="w-full primary-bg text-white font-medium py-2 rounded-lg transition-all hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-eye mr-2"></i>
                    Batafsil natijalar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-500 mb-2">Natijalar topilmadi</h3>
              <p className="text-gray-400">Qidiruv parametrlarini o'zgartirib ko'ring</p>
            </div>
          )}
        </div>
      </section>

      {/* Summary Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Umumiy Statistika</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl stat-item">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalSubjects}</div>
              <div className="text-sm text-gray-600">Jami fanlar</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl stat-item">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalStudents}</div>
              <div className="text-sm text-gray-600">Jami talabalar</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl stat-item">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{overallAverage}%</div>
              <div className="text-sm text-gray-600">Umumiy o'rtacha</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl stat-item">
              <div className="text-3xl font-bold text-purple-600 mb-2">{highestScore}%</div>
              <div className="text-sm text-gray-600">Eng yuqori</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}