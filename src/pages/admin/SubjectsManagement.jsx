import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Settings } from 'lucide-react';
import { subjectsApi } from '../../services/api';

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
    console.error('SubjectsManagement Error:', error, errorInfo);
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

const SubjectsManagementContent = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', teacherName: '', description: '' });
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setError('');
      console.log('🔍 Fetching subjects from API...');
      console.log('Environment variables:', {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        MODE: import.meta.env.MODE,
        DEV: import.meta.env.DEV
      });
      
      const response = await subjectsApi.getAll();
      console.log('✅ Subjects API response received:', response);
      
      const subjectsData = Array.isArray(response.data) ? response.data : [];
      console.log('📋 Processed subjects data:', subjectsData);
      
      setSubjects(subjectsData);
      console.log('✅ Subjects state updated successfully');
    } catch (error) {
      console.error('❌ Error in fetchSubjects:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setError(error.response?.data?.message || error.message || 'Fanlarni yuklashda xatolik yuz berdi');
      setSubjects([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchSubjects completed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLoading) return;
    
    setSubmitLoading(true);
    setError('');
    
    try {
      if (editingSubject) {
        await subjectsApi.update(editingSubject._id, formData);
      } else {
        await subjectsApi.create(formData);
      }
      await fetchSubjects();
      setShowModal(false);
      setEditingSubject(null);
      setFormData({ name: '', teacherName: '', description: '' });
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      teacherName: subject.teacherName || '',
      description: subject.description || ''
    });
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu fanni o\'chirib tashlamoqchimisiz?')) {
      try {
        await subjectsApi.delete(id);
        await fetchSubjects();
      } catch (error) {
        setError('Fanni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const openModal = () => {
    setEditingSubject(null);
    setFormData({ name: '', teacherName: '', description: '' });
    setShowModal(true);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fanlar</h1>
          <p className="text-gray-600">Fanlarni boshqarish va yangi fan qo'shish</p>
        </div>
        <button
          onClick={openModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi fan qo'shish</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject._id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {subject.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  O'qituvchi: {subject.teacherName}
                </p>
                {subject.description && (
                  <p className="text-gray-500 text-sm">{subject.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Link
                to={`/admin/subjects/${subject._id}/groups`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <Users className="h-4 w-4" />
                <span>Guruhlarni boshqarish</span>
              </Link>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(subject)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Tahrirlash"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(subject._id)}
                  className="text-gray-400 hover:text-red-600"
                  title="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {subjects.length === 0 && !loading && (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Settings className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Fanlar mavjud emas</h3>
          <p className="text-gray-600 mb-4">Birinchi fanni qo'shish uchun tugmani bosing</p>
          <button
            onClick={openModal}
            className="btn-primary"
          >
            Yangi fan qo'shish
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingSubject ? 'Fanni tahrirlash' : 'Yangi fan qo\'shish'}
                    </h3>
                    
                    {error && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fan nomi *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="input-field"
                          placeholder="Masalan: Matematika"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          O'qituvchi ism familyasi *
                        </label>
                        <input
                          type="text"
                          value={formData.teacherName}
                          onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                          className="input-field"
                          placeholder="Masalan: Olimjon Karimov"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tavsif
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="input-field"
                          rows={3}
                          placeholder="Fan haqida qo'shimcha ma'lumot"
                        />
                      </div>
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
                        {editingSubject ? 'Yangilanmoqda...' : 'Qo\'shilmoqda...'}
                      </div>
                    ) : (
                      editingSubject ? 'Yangilash' : 'Qo\'shish'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
const SubjectsManagement = () => {
  return (
    <ErrorBoundary>
      <SubjectsManagementContent />
    </ErrorBoundary>
  );
};

export default SubjectsManagement;