import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Users, Eye, EyeOff } from 'lucide-react';
import { groupsApi, studentsApi, testResultsApi } from '../../services/api';
import ZoomableImage from '../../components/ui/ZoomableImage';
import React from 'react';

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
    console.error('GroupPanel Error:', error, errorInfo);
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

// Simple Student Modal for Group Panel
const GroupStudentModal = ({ isOpen, onClose, onStudentAdded, groupId, editingStudent = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    school: '',
    grade: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstName: editingStudent.firstName || '',
        lastName: editingStudent.lastName || '',
        school: editingStudent.school || '',
        grade: editingStudent.grade || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        school: '',
        grade: ''
      });
    }
  }, [editingStudent, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      submitData.append('group', groupId);

      if (editingStudent) {
        await studentsApi.update(editingStudent._id, submitData);
      } else {
        await studentsApi.create(submitData);
      }
      onStudentAdded();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStudent ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"}
              </h3>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maktab *
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masalan: 15-son maktab"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sinf *
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masalan: 10-A"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    O'quvchi rasmi
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:ml-3 transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Saqlanmoqda...</span>
                  </div>
                ) : (
                  editingStudent ? 'Yangilash' : "Qo'shish"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-full sm:w-auto mt-3 sm:mt-0 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const GroupPanelContent = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  console.log('GroupPanel rendered with groupId:', groupId);
  console.log('Modal state:', { isStudentModalOpen, editingStudent });

  // Check if groupId exists
  if (!groupId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Guruh topilmadi</h2>
            <p className="text-gray-600 mb-4">
              Guruh ID si mavjud emas. Iltimos, to'g'ri havoladan foydalaning.
            </p>
            <Link to="/admin/subjects" className="btn-primary">
              Fanlar sahifasiga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (groupId) {
      fetchGroup();
      fetchStudents();
      fetchTestResults();
    }
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      console.log('Fetching group with ID:', groupId);
      const response = await groupsApi.getById(groupId);
      console.log('Group response:', response.data);
      setGroup(response.data);
    } catch (error) {
      console.error('Error fetching group:', error);
      setError('Guruh ma\'lumotlarini yuklashda xatolik');
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('Fetching students for group:', groupId);
      const response = await studentsApi.getAll(groupId);
      console.log('Students response:', response.data);
      const studentsData = Array.isArray(response.data) ? response.data : [];
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResults = async () => {
    try {
      console.log('Fetching test results for group:', groupId);
      const response = await testResultsApi.getAll({ groupId });
      console.log('Test results response:', response.data);
      const resultsData = Array.isArray(response.data) ? response.data : [];
      setTestResults(resultsData);
    } catch (error) {
      console.error('Error fetching test results:', error);
      setTestResults([]);
    }
  };

  const handleStudentAdded = () => {
    console.log('Student added, refreshing list...');
    fetchStudents();
    setEditingStudent(null);
  };

  const handleEditStudent = (student) => {
    console.log('Editing student:', student);
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('O\'quvchini o\'chirishni tasdiqlaysizmi?')) {
      try {
        console.log('Deleting student:', studentId);
        await studentsApi.delete(studentId);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('O\'quvchini o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const openStudentModal = () => {
    console.log('Opening student modal...');
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    console.log('Closing student modal...');
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleTogglePublish = async (testResultId) => {
    try {
      await testResultsApi.togglePublish(testResultId);
      fetchTestResults(); // Refresh the test results
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setError('Nashr holatini o\'zgartirishda xatolik yuz berdi');
    }
  };

  const openCreateTestResult = () => {
    navigate(`/admin/groups/${groupId}/test-results/create`);
  };

  const handleEditTestResult = (testResultId) => {
    navigate(`/admin/test-results/${testResultId}/edit`);
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
      <div className="flex items-center space-x-4">
        <Link
          to={`/admin/subjects/${group?.subject?._id}/groups`}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {group?.subject?.name} - Guruh {group?.name}
          </h1>
          <p className="text-gray-600">
            O'qituvchi: {group?.subject?.teacherName || group?.teacherName}
          </p>
          <p className="text-sm text-gray-500">
            Jami o'quvchilar: {students.length} ta
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-5 w-5 inline mr-2" />
            O'quvchilar ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-5 w-5 inline mr-2" />
            Test natijalari ({testResults.length})
          </button>
        </nav>
      </div>

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Guruh o'quvchilari</h2>
            <button 
              onClick={openStudentModal}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>O'quvchi qo'shish</span>
            </button>
          </div>
          
          {students.length > 0 ? (
            <>
              {/* Students Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-blue-900">Guruh o'quvchilari</h3>
                    <p className="text-sm text-blue-700">
                      Jami: <span className="font-semibold">{students.length} ta o'quvchi</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Students Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {students.map((student, index) => (
                  <div 
                    key={student._id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                  >
                    <div className="relative">
                      {student.imageUrl ? (
                        <div className="h-48 overflow-hidden">
                          <ZoomableImage
                            src={student.imageUrl}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <Users className="h-16 w-16 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {student.firstName} {student.lastName}
                      </h3>
                      
                      <div className="space-y-2">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Maktab:</span> {student.school}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Sinf:</span> {student.grade}
                        </p>
                      </div>
                      
                      <div className="flex justify-end mt-4 space-x-2">
                        <button 
                          onClick={() => handleEditStudent(student)}
                          className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student._id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Hali o'quvchilar mavjud emas</h3>
              <p className="text-gray-600 mb-6">Bu guruhga birinchi o'quvchini qo'shish uchun tugmani bosing</p>
              <button 
                onClick={openStudentModal}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Birinchi o'quvchini qo'shish</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Test Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Test natijalari</h2>
            <button 
              onClick={openCreateTestResult}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Natija qo'shish</span>
            </button>
          </div>
          
          {testResults.length > 0 ? (
            <div className="space-y-4">
              {testResults.map((result) => (
                <div key={result._id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {result.testName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(result.testDate).toLocaleDateString('uz-UZ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        O'rtacha ball: {result.averageScore?.toFixed(1) || 0}%
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.isPublished ? 'Nashr qilingan' : 'Loyiha'}
                      </span>
                      <button 
                        onClick={() => handleTogglePublish(result._id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={result.isPublished ? 'Nashrdan olib tashlash' : 'Nashr qilish'}
                      >
                        {result.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleEditTestResult(result._id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Tahrirlash"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {result.totalStudents} ta o'quvchi ishtirok etgan
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Test natijalari mavjud emas</h3>
              <p className="text-gray-600 mb-4">Birinchi test natijasini qo'shish uchun tugmani bosing</p>
              <button 
                onClick={openCreateTestResult}
                className="btn-primary"
              >
                Yangi natija qo'shish
              </button>
            </div>
          )}
        </div>
      )}

      {/* Student Modal */}
      <GroupStudentModal
        isOpen={isStudentModalOpen}
        onClose={closeStudentModal}
        onStudentAdded={handleStudentAdded}
        groupId={groupId}
        editingStudent={editingStudent}
      />
    </div>
  );
};

// Main component wrapped with Error Boundary
const GroupPanel = () => {
  return (
    <ErrorBoundary>
      <GroupPanelContent />
    </ErrorBoundary>
  );
};

export default GroupPanel;