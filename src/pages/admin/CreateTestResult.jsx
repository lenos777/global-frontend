import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { groupsApi, studentsApi, testResultsApi } from '../../services/api';

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
    console.error('CreateTestResult Error:', error, errorInfo);
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

const CreateTestResultContent = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentScores, setStudentScores] = useState({});

  useEffect(() => {
    if (groupId) {
      fetchGroupAndStudents();
    }
  }, [groupId]);

  const fetchGroupAndStudents = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch group and students in parallel
      const [groupResponse, studentsResponse] = await Promise.all([
        groupsApi.getById(groupId),
        studentsApi.getAll(groupId)
      ]);

      setGroup(groupResponse.data);
      const studentsData = Array.isArray(studentsResponse.data) ? studentsResponse.data : [];
      setStudents(studentsData);

      // Initialize scores object with empty percentages
      const initialScores = {};
      studentsData.forEach(student => {
        initialScores[student._id] = {
          student: student._id,
          score: '',
          maxScore: 100,
          percentage: ''
        };
      });
      setStudentScores(initialScores);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId, field, value) => {
    setStudentScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
        // Auto-calculate percentage if score and maxScore are provided
        ...(field === 'score' || field === 'maxScore' ? {
          percentage: prev[studentId].maxScore && value ? 
            Math.round((value / prev[studentId].maxScore) * 100) : ''
        } : {})
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!testDate) {
      setError('Test sanasi kiritilishi shart');
      return;
    }

    // Validate that at least one student has a score
    const hasAnyScore = Object.values(studentScores).some(score => 
      score.score !== '' || score.percentage !== ''
    );

    if (!hasAnyScore) {
      setError('Hech bo\'lmaganda bitta o\'quvchi uchun natija kiritilishi kerak');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Prepare results data
      const results = Object.values(studentScores)
        .filter(score => score.score !== '' || score.percentage !== '')
        .map(score => ({
          student: score.student,
          score: parseFloat(score.score) || 0,
          maxScore: parseFloat(score.maxScore) || 100,
          percentage: parseFloat(score.percentage) || Math.round((score.score / score.maxScore) * 100)
        }));

      // Generate automatic test name based on date
      const formattedDate = new Date(testDate).toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const automaticTestName = `Test natijasi - ${formattedDate}`;

      const testResultData = {
        group: groupId,
        testName: automaticTestName,
        testDate,
        description: '',
        results,
        isPublished: true // Automatically publish new test results
      };

      console.log('Submitting test result:', testResultData);
      
      await testResultsApi.create(testResultData);
      
      // Navigate back to group panel
      navigate(`/admin/groups/${groupId}`, { 
        state: { message: 'Test natijasi muvaffaqiyatli saqlandi!' }
      });

    } catch (error) {
      console.error('Error saving test result:', error);
      setError(error.response?.data?.message || 'Test natijasini saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to={`/admin/groups/${groupId}`}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Test natijalarini qo'shish
          </h1>
          <p className="text-gray-600">
            {group?.subject?.name} - Guruh {group?.name}
          </p>
          <p className="text-sm text-gray-500">
            O'qituvchi: {group?.subject?.teacherName || group?.teacherName}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Test Information Form */}
      <form onSubmit={handleSubmit}>
        <div className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test sanasi *
              </label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Students Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                O'quvchilar natijalari ({students.length})
              </h3>
            </div>

            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        O'quvchi ismi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maktab
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sinf
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ball
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maksimal ball
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Foiz (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.school}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.grade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max={studentScores[student._id]?.maxScore || 100}
                            value={studentScores[student._id]?.score || ''}
                            onChange={(e) => handleScoreChange(student._id, 'score', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={studentScores[student._id]?.maxScore || 100}
                            onChange={(e) => handleScoreChange(student._id, 'maxScore', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={studentScores[student._id]?.percentage || ''}
                            onChange={(e) => handleScoreChange(student._id, 'percentage', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                          />
                          <span className="ml-1 text-xs text-gray-500">%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hali o'quvchilar mavjud emas</h3>
                <p className="text-gray-600">Avval guruhga o'quvchilar qo'shing</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Link
              to={`/admin/groups/${groupId}`}
              className="btn-secondary"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={saving || students.length === 0}
              className={`btn-primary flex items-center space-x-2 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Saqlash</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Main component wrapped with Error Boundary
const CreateTestResult = () => {
  return (
    <ErrorBoundary>
      <CreateTestResultContent />
    </ErrorBoundary>
  );
};

export default CreateTestResult;