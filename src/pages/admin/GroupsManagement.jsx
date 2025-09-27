import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, ArrowLeft, Settings } from 'lucide-react';
import { groupsApi, subjectsApi, studentsApi } from '../../services/api';

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
    console.error('GroupsManagement Error:', error, errorInfo);
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

const GroupsManagementContent = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupStudents, setGroupStudents] = useState({}); // Store students for each group
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({ name: '', teacherName: '' });
  const [error, setError] = useState('');


  useEffect(() => {
    if (subjectId) {
      fetchSubject();
      fetchGroups();
    } else {
      setError('Fan identifikatori topilmadi');
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    // Fetch students for each group when groups change
    if (groups.length > 0) {
      groups.forEach(group => {
        fetchGroupStudents(group._id);
      });
    }
  }, [groups]);

  const fetchSubject = async () => {
    if (!subjectId) return;
    
    try {
      const response = await subjectsApi.getById(subjectId);
      setSubject(response.data);
    } catch (error) {
      console.error('Error fetching subject:', error);
      setError('Fan ma\'lumotlarini yuklashda xatolik');
    }
  };

  const fetchGroups = async () => {
    if (!subjectId) return;
    
    try {
      const response = await groupsApi.getAll(subjectId);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Guruhlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupStudents = async (groupId) => {
    try {
      const response = await studentsApi.getAll(groupId);
      setGroupStudents(prev => ({
        ...prev,
        [groupId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching group students:', error);
      setGroupStudents(prev => ({
        ...prev,
        [groupId]: []
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, subject: subjectId };
      if (editingGroup) {
        await groupsApi.update(editingGroup._id, data);
      } else {
        await groupsApi.create(data);
      }
      await fetchGroups();
      setShowModal(false);
      setEditingGroup(null);
      setFormData({ name: '', teacherName: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      teacherName: group.teacherName || ''
    });
    setShowModal(true);
  };



  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu guruhni o\'chirib tashlamoqchimisiz?')) {
      try {
        await groupsApi.delete(id);
        await fetchGroups();
      } catch (error) {
        setError('Guruhni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const openModal = () => {
    setEditingGroup(null);
    setFormData({ name: '', teacherName: '' });
    setShowModal(true);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!subjectId) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Fan identifikatori topilmadi</h2>
        <p className="text-gray-600 mb-4">
          Guruhlarni boshqarish uchun avval fanni tanlang.
        </p>
        <Link to="/admin/subjects" className="btn-primary">
          Fanlar bo'limiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/admin/subjects"
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {subject?.name} - Guruhlar
          </h1>
          <p className="text-gray-600">
            O'qituvchi: {subject?.teacherName}
          </p>
        </div>
        <button
          onClick={openModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi guruh qo'shish</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const students = groupStudents[group._id] || [];
          
          return (
            <div key={group._id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Guruh {group.name}
                  </h3>
                  {group.teacherName && (
                    <p className="text-gray-600 text-sm mb-2">
                      Repetitor: {group.teacherName}
                    </p>
                  )}
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{students.length}</span> ta o'quvchi
                  </div>
                </div>
              </div>
              
              {/* Students List */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">O'quvchilar:</h4>
                {students.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {students.map((student, index) => (
                        <li key={student._id} className="flex items-center">
                          <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                            {index + 1}
                          </span>
                          {student.firstName} {student.lastName}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">Hali o'quvchilar mavjud emas</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <Link
                    to={`/admin/groups/${group._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Users className="h-4 w-4" />
                    <span>Guruh paneli</span>
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(group)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Tahrirlash"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(group._id)}
                      className="text-gray-400 hover:text-red-600"
                      title="O'chirish"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {groups.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Settings className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Guruhlar mavjud emas</h3>
          <p className="text-gray-600 mb-4">Birinchi guruhni qo'shish uchun tugmani bosing</p>
          <button
            onClick={openModal}
            className="btn-primary"
          >
            Yangi guruh qo'shish
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
                      {editingGroup ? 'Guruhni tahrirlash' : 'Yangi guruh qo\'shish'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Repetitor nomi *
                        </label>
                        <input
                          type="text"
                          value={formData.teacherName}
                          onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                          className="input-field"
                          placeholder="Masalan: Aziza Rahimova"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Guruh nomi *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="input-field"
                          placeholder="Masalan: A, B, C yoki 1-guruh"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {editingGroup ? 'Yangilash' : 'Qo\'shish'}
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
const GroupsManagement = () => {
  return (
    <ErrorBoundary>
      <GroupsManagementContent />
    </ErrorBoundary>
  );
};

export default GroupsManagement;