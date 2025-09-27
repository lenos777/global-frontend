import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Award } from 'lucide-react';
import { achievementsApi } from '../../services/api';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminAchievements Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Xatolik yuz berdi</h2>
              <p className="text-gray-600 mb-4">
                Sahifani yuklashda muammo yuz berdi. Iltimos, sahifani yangilang.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Sahifani yangilash
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AdminAchievementsContent = () => {
  console.log('AdminAchievements component loading...');
  
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    age: '',
    school: '',
    title: '',
    level: '',
    isPublished: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, [currentPage]);

  const fetchAchievements = async () => {
    try {
      setError(''); // Clear any previous errors
      const response = await achievementsApi.getAll({}, currentPage, itemsPerPage);
      
      // Handle both old and new API response formats
      if (response.data.pagination) {
        // New paginated format
        const achievementsData = Array.isArray(response.data.data) ? response.data.data : [];
        setAchievements(achievementsData);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setHasNextPage(response.data.pagination.hasNextPage);
        setHasPrevPage(response.data.pagination.hasPrevPage);
      } else {
        // Old format (fallback)
        const achievementsData = Array.isArray(response.data) ? response.data : [];
        setAchievements(achievementsData);
        setTotalPages(1);
        setTotalItems(achievementsData.length);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError(error.response?.data?.message || 'Yutuqlarni yuklashda xatolik yuz berdi');
      setAchievements([]); // Ensure achievements is always an array
      setTotalPages(1);
      setTotalItems(0);
      setHasNextPage(false);
      setHasPrevPage(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    // No longer needed since we removed group requirement
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLoading) return; // Prevent double submission
    
    setSubmitLoading(true);
    setError('');
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingAchievement) {
        await achievementsApi.update(editingAchievement._id, submitData);
      } else {
        await achievementsApi.create(submitData);
      }
      await fetchAchievements();
      closeModal();
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (achievement) => {
    if (!achievement) {
      console.error('No achievement data provided for editing');
      return;
    }
    
    setEditingAchievement(achievement);
    setFormData({
      studentName: achievement.studentName || '',
      age: (achievement.age || '').toString(),
      school: achievement.school || '',
      title: achievement.title || '',
      level: achievement.level || '',
      isPublished: achievement.isPublished !== undefined ? achievement.isPublished : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu yutuqni o\'chirib tashlamoqchimisiz?')) {
      try {
        await achievementsApi.delete(id);
        await fetchAchievements();
      } catch (error) {
        setError('Yutuqni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const togglePublish = async (id) => {
    try {
      await achievementsApi.togglePublish(id);
      await fetchAchievements();
    } catch (error) {
      setError('Nashr holatini o\'zgartirishda xatolik yuz berdi');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAchievement(null);
    setFormData({
      studentName: '',
      age: '',
      school: '',
      title: '',
      level: '',
      isPublished: true
    });
    setImageFile(null);
    setError('');
  };

  const loadMoreAchievements = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const showAllAchievementsHandler = async () => {
    setShowAllAchievements(true);
    try {
      const response = await achievementsApi.getAll({}, 1, totalItems);
      // Handle both old and new API response formats
      if (response.data.pagination) {
        const achievementsData = Array.isArray(response.data.data) ? response.data.data : [];
        setAchievements(achievementsData);
      } else {
        const achievementsData = Array.isArray(response.data) ? response.data : [];
        setAchievements(achievementsData);
      }
    } catch (error) {
      console.error('Error fetching all achievements:', error);
      setError(error.response?.data?.message || 'Barcha yutuqlarni yuklashda xatolik yuz berdi');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yutuqlar</h1>
          <p className="text-gray-600">Yutuqlarni boshqarish va yangi yutuq qo'shish</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi yutuq qo'shish</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div key={achievement._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
            {achievement.imageUrl && (
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={achievement.imageUrl}
                  alt={achievement.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {achievement.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  achievement.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {achievement.isPublished ? 'Nashr qilingan' : 'Loyiha'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-1">{achievement.studentName}</p>
              {achievement.school && (
                <p className="text-sm text-gray-500 mb-2">{achievement.school}</p>
              )}
              <p className="text-sm font-medium text-primary-600 mb-2">
                {achievement.level}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {new Date(achievement.achievementDate || achievement.createdAt).toLocaleDateString('uz-UZ')}
              </p>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => togglePublish(achievement._id)}
                  className="text-gray-400 hover:text-gray-600"
                  title={achievement.isPublished ? 'Nashrdan olib tashlash' : 'Nashr qilish'}
                >
                  {achievement.isPublished ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement._id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!showAllAchievements && totalPages > 1 && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Jami: {totalItems} ta yutuq, {currentPage}/{totalPages} sahifa
            </div>
            <div className="flex space-x-2">
              {hasPrevPage && (
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Oldingi
                </button>
              )}
              {hasNextPage && (
                <button
                  onClick={loadMoreAchievements}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Yana 10 ta yuklash
                </button>
              )}
              {totalItems > 10 && (
                <button
                  onClick={showAllAchievementsHandler}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Barchasini ko'rsatish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {showAllAchievements && totalItems > 10 && (
        <div className="card p-4">
          <button
            onClick={() => {
              setShowAllAchievements(false);
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Qisqartirilgan ko'rinish
          </button>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Award className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Yutuqlar mavjud emas</h3>
          <p className="text-gray-600 mb-4">Birinchi yutuqni qo'shish uchun tugmani bosing</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Yangi yutuq qo'shish
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingAchievement ? 'Yutuqni tahrirlash' : 'Yangi yutuq qo\'shish'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ism familya *
                      </label>
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                        className="input-field"
                        placeholder="Masalan: Alisher Aliyev"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yosh *
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="input-field"
                        min="5"
                        max="30"
                        placeholder="16"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maktab
                      </label>
                      <input
                        type="text"
                        value={formData.school}
                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                        className="input-field"
                        placeholder="Masalan: 25-son maktab"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yutuq nomi *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="input-field"
                        placeholder="Masalan: IELTS, TOEFL, CEFR"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yutuq darajasi *
                      </label>
                      <input
                        type="text"
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="input-field"
                        placeholder="Masalan: 7.5, 8.0, B2, C1"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yutuq rasmi
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="input-field"
                        accept="image/*"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Sertifikat yoki yutuq rasmini yuklang (PNG, JPG, JPEG)
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Darhol nashr qilish</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className={`btn-primary w-full sm:w-auto sm:ml-3 ${
                      submitLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingAchievement ? 'Yangilanmoqda...' : 'Qo\'shilmoqda...'}
                      </div>
                    ) : (
                      editingAchievement ? 'Yangilash' : 'Qo\'shish'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component wrapped with Error Boundary
const AdminAchievements = () => {
  return (
    <ErrorBoundary>
      <AdminAchievementsContent />
    </ErrorBoundary>
  );
};

export default AdminAchievements;