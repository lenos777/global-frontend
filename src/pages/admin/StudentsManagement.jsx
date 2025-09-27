import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Users, School, Phone, User } from 'lucide-react';
import { studentsApi, groupsApi } from '../../services/api';
import StudentModal from '../../components/ui/StudentModal';

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
    console.error('StudentsManagement Error:', error, errorInfo);
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

const StudentsManagementContent = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    groupsCount: 0
  });
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, [currentPage, selectedGroup]);

  useEffect(() => {
    calculateStats();
  }, [students]);

  const fetchStudents = async () => {
    try {
      setError('');
      const response = await studentsApi.getAll(
        selectedGroup || null, 
        currentPage, 
        itemsPerPage
      );
      
      // Handle both old and new API response formats
      if (response.data.pagination) {
        // New paginated format
        const studentData = Array.isArray(response.data.data) ? response.data.data : [];
        setStudents(studentData);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setHasNextPage(response.data.pagination.hasNextPage);
        setHasPrevPage(response.data.pagination.hasPrevPage);
      } else {
        // Old format (fallback)
        const studentData = Array.isArray(response.data) ? response.data : [];
        setStudents(studentData);
        setTotalPages(1);
        setTotalItems(studentData.length);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.response?.data?.message || 'O\'quvchilarni yuklashda xatolik yuz berdi');
      setStudents([]);
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
      setGroups(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
  };

  const calculateStats = () => {
    if (!Array.isArray(students)) return;
    
    const active = students.filter(s => s.isActive !== false).length;
    const inactive = students.filter(s => s.isActive === false).length;
    const uniqueGroups = new Set(students.map(s => s.group?._id).filter(Boolean)).size;
    
    setStats({
      total: totalItems, // Use total items from pagination
      active,
      inactive,
      groupsCount: uniqueGroups
    });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu o\'quvchini o\'chirib tashlamoqchimisiz?')) {
      try {
        await studentsApi.delete(id);
        await fetchStudents();
      } catch (error) {
        setError('O\'quvchini o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleStudentSaved = () => {
    fetchStudents();
    handleModalClose();
  };

  const loadMoreStudents = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const showAllStudentsHandler = async () => {
    setShowAllStudents(true);
    try {
      const response = await studentsApi.getAll(selectedGroup || null, 1, totalItems);
      // Handle both old and new API response formats
      if (response.data.pagination) {
        const studentData = Array.isArray(response.data.data) ? response.data.data : [];
        setStudents(studentData);
      } else {
        const studentData = Array.isArray(response.data) ? response.data : [];
        setStudents(studentData);
      }
    } catch (error) {
      console.error('Error fetching all students:', error);
      setError(error.response?.data?.message || 'Barcha o\'quvchilarni yuklashda xatolik yuz berdi');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = !selectedGroup || student.group?._id === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
          <p className="text-gray-600">O'quvchilarni boshqarish va yangi o'quvchi qo'shish</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi o'quvchi qo'shish</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jami o'quvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faol o'quvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <User className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nofaol o'quvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <School className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Guruhlar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.groupsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="O'quvchi qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <select
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className="input-field"
          >
            <option value="">Barcha guruhlar</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.subject?.name || 'Fan nomi'} - {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'quvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maktab va sinf
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guruh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aloqa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {student.imageUrl ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={student.imageUrl} 
                            alt={`${student.firstName} ${student.lastName}`} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {student._id?.slice(-8) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.school}</div>
                    <div className="text-sm text-gray-500">{student.grade}-sinf</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.group?.subject?.name || 'Fan nomi'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.group?.name || 'Guruh nomi'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      {student.parentContact || 'Kiritilmagan'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.isActive !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive !== false ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Tahrirlash"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-900"
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || selectedGroup ? 'Hech narsa topilmadi' : 'O\'quvchilar mavjud emas'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedGroup 
                  ? 'Qidiruv shartlarini o\'zgartiring yoki filterni olib tashlang' 
                  : 'Birinchi o\'quvchini qo\'shish uchun tugmani bosing'
                }
              </p>
              {!searchTerm && !selectedGroup && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                  >
                    Yangi o'quvchi qo'shish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {!showAllStudents && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Jami: {totalItems} ta o'quvchi, {currentPage}/{totalPages} sahifa
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
                    onClick={loadMoreStudents}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Yana 10 ta yuklash
                  </button>
                )}
                {totalItems > 10 && (
                  <button
                    onClick={showAllStudentsHandler}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Barchasini ko'rsatish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {showAllStudents && totalItems > 10 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAllStudents(false);
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Qisqartirilgan ko'rinish
            </button>
          </div>
        )}
      </div>

      {/* Student Modal */}
      {showModal && (
        <StudentModal
          student={editingStudent}
          groups={groups}
          onClose={handleModalClose}
          onSave={handleStudentSaved}
        />
      )}
    </div>
  );
};

// Main component wrapped with Error Boundary
const StudentsManagement = () => {
  return (
    <ErrorBoundary>
      <StudentsManagementContent />
    </ErrorBoundary>
  );
};

export default StudentsManagement;