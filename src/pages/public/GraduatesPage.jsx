import { useState, useEffect } from 'react';
import { GraduationCap, Award, Filter, Building } from 'lucide-react';
import { graduatesApi } from '../../services/api';
import ZoomableImage from '../../components/ui/ZoomableImage';

const GraduatesPage = () => {
  const [graduates, setGraduates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [availableFields, setAvailableFields] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Barchasi'); // Default to 'Barchasi'
  const [page, setPage] = useState(1); // Add page state for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load

  // Effect to fetch graduates data
  useEffect(() => {
    // Reset page and graduates when filters change
    setPage(1);
    setGraduates([]);
    fetchGraduates(1);
  }, [selectedType, selectedField]);

  const fetchGraduates = async (pageNum = page) => {
    try {
      const filters = { published: true };
      if (selectedType) filters.admissionType = selectedType;
      if (selectedField) filters.field = selectedField;
      
      // Add pagination parameters
      filters.page = pageNum;
      filters.limit = 8; // Load 8 items at a time
      
      const response = await graduatesApi.getAll(filters);
      
      // Update graduates list - if page 1, replace, else append
      if (pageNum === 1) {
        setGraduates(response.data);
      } else {
        setGraduates(prev => [...prev, ...response.data]);
      }
      
      // Check if there are more items to load
      setHasMore(response.data.length === 8);
      
      // Extract unique fields for filter
      if (!selectedField && pageNum === 1) {
        const fields = [...new Set(response.data.map(g => g.field))].sort();
        setAvailableFields(fields);
      }
    } catch (error) {
      console.error('Error fetching graduates:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedType('');
    setSelectedField('');
    setActiveFilter('Barchasi');
  };

  // Add handleFilterClick function
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'Barchasi') {
      setSelectedType('');
    } else if (filter === 'Grant') {
      setSelectedType('grant');
    } else if (filter === 'Kontrakt') {
      setSelectedType('contract');
    }
  };

  // Load more handler
  const loadMore = () => {
    if (loading || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGraduates(nextPage);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const filters = [
    'Barchasi',
    'Grant',
    'Kontrakt'
  ];

  return (
    <div className="font-sans bg-gray-50 pb-16 md:pb-0">
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

      {/* Students Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {graduates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {graduates.map((graduate) => (
                <div 
                  key={graduate._id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <div className="relative">
                    {graduate.imageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <ZoomableImage
                          src={graduate.imageUrl}
                          alt={`${graduate.firstName} ${graduate.lastName}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <GraduationCap className="h-16 w-16 text-white" />
                      </div>
                    )}
                    
                    <div className={`absolute top-3 right-3 text-white px-3 py-1 rounded-full text-sm font-medium ${
                      graduate.admissionType === 'grant' 
                        ? 'bg-gradient-to-br from-green-500 to-green-600' 
                        : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                    }`}>
                      {graduate.admissionType === 'grant' ? 'Grant' : 'Kontrakt'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {graduate.firstName} {graduate.lastName}
                    </h3>
                    
                    <p className="bg-gradient-to-br from-blue-800 to-blue-600 bg-clip-text text-lg font-semibold mb-3 text-transparent">
                      {graduate.university}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{graduate.field}</span>
                      <span className={`font-medium text-sm ${
                        graduate.admissionType === 'grant' 
                          ? 'text-green-500' 
                          : 'text-yellow-500'
                      }`}>
                        {graduate.admissionType === 'grant' 
                          ? (graduate.finalScore ? `${graduate.finalScore}% Grant` : 'Grant') 
                          : 'Kontrakt'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button className="bg-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg" onClick={loadMore}>
                  Ko'proq yuklash
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">
              {(selectedType || selectedField) ? 'Tanlangan filtr bo\'yicha talabalar topilmadi' : 'Talabalar ma\'lumotlari mavjud emas'}
            </h3>
            <p className="mt-1 text-gray-500">
              {(selectedType || selectedField) ? 'Boshqa filtrlarni sinab ko\'ring' : 'Talabalar ma\'lumotlari tez orada yuklanadi'}
            </p>
            {(selectedType || selectedField) && (
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="bg-blue-800 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Barcha talabalarni ko'rish
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GraduatesPage;