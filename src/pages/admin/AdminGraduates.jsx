import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { graduatesApi, groupsApi, resolveImageUrl } from '../../services/api';

const AdminGraduates = () => {
  const [graduates, setGraduates] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGraduate, setEditingGraduate] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionType: 'grant',
    field: '',
    university: '',
    admissionYear: new Date().getFullYear(),
    previousGroup: '',
    graduationYear: '',
    finalScore: '',
    notes: '',
    isPublished: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [showAllGraduates, setShowAllGraduates] = useState(false);

  useEffect(() => {
    fetchGraduates();
    fetchGroups();
  }, [currentPage]);

  const fetchGraduates = async () => {
    try {
      const response = await graduatesApi.getAll({}, currentPage, itemsPerPage);
      
      // Handle both old and new API response formats
      if (response.data.pagination) {
        // New paginated format
        const graduatesData = Array.isArray(response.data.data) ? response.data.data : [];
        const mapped = graduatesData.map(g => ({ ...g, imageUrl: g.imageUrl ? resolveImageUrl(g.imageUrl) : '' }));
        setGraduates(mapped);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setHasNextPage(response.data.pagination.hasNextPage);
        setHasPrevPage(response.data.pagination.hasPrevPage);
      } else {
        // Old format (fallback)
        const graduatesData = Array.isArray(response.data) ? response.data : [];
        const mapped = graduatesData.map(g => ({ ...g, imageUrl: g.imageUrl ? resolveImageUrl(g.imageUrl) : '' }));
        setGraduates(mapped);
        setTotalPages(1);
        setTotalItems(graduatesData.length);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (error) {
      console.error('Error fetching graduates:', error);
      setError('Talabalarni yuklashda xatolik yuz berdi');
      setGraduates([]);
      setTotalPages(1);
      setTotalItems(0);
      setHasNextPage(false);
      setHasPrevPage(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await groupsApi.getAll();
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingGraduate) {
        await graduatesApi.update(editingGraduate._id, submitData);
      } else {
        await graduatesApi.create(submitData);
      }
      await fetchGraduates();
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleEdit = (graduate) => {
    setEditingGraduate(graduate);
    setFormData({
      firstName: graduate.firstName,
      lastName: graduate.lastName,
      admissionType: graduate.admissionType,
      field: graduate.field,
      university: graduate.university,
      admissionYear: graduate.admissionYear,
      previousGroup: graduate.previousGroup?._id || '',
      graduationYear: graduate.graduationYear || '',
      finalScore: graduate.finalScore || '',
      notes: graduate.notes || '',
      isPublished: graduate.isPublished
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu talabani o\'chirib tashlamoqchimisiz?')) {
      try {
        await graduatesApi.delete(id);
        await fetchGraduates();
      } catch (error) {
        setError('Talabani o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const togglePublish = async (id) => {
    try {
      await graduatesApi.togglePublish(id);
      await fetchGraduates();
    } catch (error) {
      setError('Nashr holatini o\'zgartirishda xatolik yuz berdi');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGraduate(null);
    setFormData({
      firstName: '',
      lastName: '',
      admissionType: 'grant',
      field: '',
      university: '',
      admissionYear: new Date().getFullYear(),
      previousGroup: '',
      graduationYear: '',
      finalScore: '',
      notes: '',
      isPublished: true
    });
    setImageFile(null);
    setError('');
  };

  const loadMoreGraduates = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const showAllGraduatesHandler = async () => {
    setShowAllGraduates(true);
    try {
      const response = await graduatesApi.getAll({}, 1, totalItems);
      // Handle both old and new API response formats
      if (response.data.pagination) {
        const graduatesData = Array.isArray(response.data.data) ? response.data.data : [];
        const mapped = graduatesData.map(g => ({ ...g, imageUrl: g.imageUrl ? resolveImageUrl(g.imageUrl) : '' }));
        setGraduates(mapped);
      } else {
        const graduatesData = Array.isArray(response.data) ? response.data : [];
        const mapped = graduatesData.map(g => ({ ...g, imageUrl: g.imageUrl ? resolveImageUrl(g.imageUrl) : '' }));
        setGraduates(mapped);
      }
    } catch (error) {
      console.error('Error fetching all graduates:', error);
      setError(error.response?.data?.message || 'Barcha talabalarni yuklashda xatolik yuz berdi');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Talabalar</h1>
          <p className="text-gray-600">Bitiruvchilarni boshqarish va yangi talaba qo'shish</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi talaba qo'shish</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {graduates.map((graduate) => (
          <div 
            key={graduate._id} 
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {graduate.imageUrl ? (
              <div className="h-48 overflow-hidden">
                <img
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
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {graduate.firstName} {graduate.lastName}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  graduate.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {graduate.isPublished ? 'Nashr qilingan' : 'Loyiha'}
                </span>
              </div>
              
              <p className="bg-gradient-to-br from-blue-800 to-blue-600 bg-clip-text text-lg font-semibold mb-2 text-transparent">
                {graduate.university}
              </p>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  graduate.admissionType === 'grant' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {graduate.admissionType === 'grant' ? 'Grant' : 'Kontrakt'}
                </span>
                <span className="text-xs text-gray-500">
                  {graduate.admissionYear}-yil
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{graduate.field}</p>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => togglePublish(graduate._id)}
                  className="text-gray-400 hover:text-gray-600"
                  title={graduate.isPublished ? 'Nashrdan olib tashlash' : 'Nashr qilish'}
                >
                  {graduate.isPublished ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(graduate)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(graduate._id)}
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
      {!showAllGraduates && totalPages > 1 && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Jami: {totalItems} ta talaba, {currentPage}/{totalPages} sahifa
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
                  onClick={loadMoreGraduates}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Yana 10 ta yuklash
                </button>
              )}
              {totalItems > 10 && (
                <button
                  onClick={showAllGraduatesHandler}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Barchasini ko'rsatish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {showAllGraduates && totalItems > 10 && (
        <div className="card p-4">
          <button
            onClick={() => {
              setShowAllGraduates(false);
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Qisqartirilgan ko'rinish
          </button>
        </div>
      )}

      {graduates.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <GraduationCap className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Talabalar mavjud emas</h3>
          <p className="text-gray-600 mb-6">Birinchi talabani qo'shish uchun tugmani bosing</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Yangi talaba qo'shish
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
                    {editingGraduate ? 'Talabani tahrirlash' : 'Yangi talaba qo\'shish'}
                  </h3>
                  
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ism *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Familya *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qabul turi *
                      </label>
                      <select
                        value={formData.admissionType}
                        onChange={(e) => setFormData({...formData, admissionType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="grant">Grant</option>
                        <option value="contract">Kontrakt</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soha *
                      </label>
                      <input
                        type="text"
                        value={formData.field}
                        onChange={(e) => setFormData({...formData, field: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masalan: Dasturlash"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Universitet *
                      </label>
                      <input
                        type="text"
                        value={formData.university}
                        onChange={(e) => setFormData({...formData, university: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masalan: TATU"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qabul yili *
                      </label>
                      <input
                        type="number"
                        value={formData.admissionYear}
                        onChange={(e) => setFormData({...formData, admissionYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="2000"
                        max={new Date().getFullYear() + 5}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Oldingi guruh
                      </label>
                      <select
                        value={formData.previousGroup}
                        onChange={(e) => setFormData({...formData, previousGroup: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Guruhni tanlang</option>
                        {groups.map((group) => (
                          <option key={group._id} value={group._id}>
                            {group.subject.name} - Guruh {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bitiruv yili
                      </label>
                      <input
                        type="number"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="2015"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yakuniy ball
                      </label>
                      <input
                        type="number"
                        value={formData.finalScore}
                        onChange={(e) => setFormData({...formData, finalScore: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Talaba rasmi
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        accept="image/*"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Eslatmalar
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Qo'shimcha ma'lumotlar"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Darhol nashr qilish</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:ml-3 transition-colors"
                  >
                    {editingGraduate ? 'Yangilash' : 'Qo\'shish'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-full sm:w-auto mt-3 sm:mt-0 transition-colors"
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

export default AdminGraduates;