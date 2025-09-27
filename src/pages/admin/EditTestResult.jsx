import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Save } from 'lucide-react';
import { testResultsApi, groupsApi, studentsApi } from '../../services/api';

export default function EditTestResult() {
  const { testResultId } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [testResult, setTestResult] = useState(null);
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [testName, setTestName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [description, setDescription] = useState('');
  const [studentScores, setStudentScores] = useState({});
  const [isPublished, setIsPublished] = useState(true);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (testResultId) {
      fetchTestResult();
    }
  }, [testResultId]);

  const fetchTestResult = async () => {
    try {
      setLoading(true);
      const testResultResponse = await testResultsApi.getById(testResultId);
      const testResultData = testResultResponse.data;
      
      setTestResult(testResultData);
      setTestName(testResultData.testName);
      setTestDate(testResultData.testDate.split('T')[0]); // Format for date input
      setDescription(testResultData.description || '');
      setIsPublished(testResultData.isPublished);
      
      // Fetch group and students
      const [groupResponse, studentsResponse] = await Promise.all([
        groupsApi.getById(testResultData.group._id),
        studentsApi.getAll(testResultData.group._id)
      ]);

      setGroup(groupResponse.data);
      const studentsData = Array.isArray(studentsResponse.data) ? studentsResponse.data : [];
      setStudents(studentsData);

      // Initialize scores from existing results
      const initialScores = {};
      studentsData.forEach(student => {
        const existingResult = testResultData.results.find(r => r.student._id === student._id);
        initialScores[student._id] = {
          student: student._id,
          score: existingResult ? existingResult.score : '',
          maxScore: existingResult ? existingResult.maxScore : 100,
          percentage: existingResult ? existingResult.percentage : ''
        };
      });
      setStudentScores(initialScores);

    } catch (error) {
      console.error('Error fetching test result:', error);
      setError('Test natijasini yuklashda xatolik yuz berdi');
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
    
    if (!testName.trim() || !testDate) {
      setError('Test nomi va sanasi kiritilishi shart');
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

      const testResultData = {
        group: group._id,
        testName: testName.trim(),
        testDate,
        description: description.trim(),
        results,
        isPublished
      };

      console.log('Updating test result:', testResultData);
      
      await testResultsApi.update(testResultId, testResultData);
      
      // Navigate back to group panel
      navigate(`/admin/groups/${group._id}`, { 
        state: { message: 'Test natijasi muvaffaqiyatli yangilandi!' }
      });

    } catch (error) {
      console.error('Error updating test result:', error);
      setError(error.response?.data?.message || 'Test natijasini yangilashda xatolik yuz berdi');
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

  if (!testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Test natijasi topilmadi</h2>
            <p className="text-gray-600 mb-4">
              Bunday test natijasi mavjud emas.
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
          to={`/admin/groups/${group?._id}`}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Test natijasini tahrirlash
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test nomi *
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="input-field"
                placeholder="Masalan: 1-chorak test"
                required
              />
            </div>
            
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tavsif
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="Qo'shimcha ma'lumot"
              />
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm font-medium text-blue-900">
                {isPublished ? '✅ Nashr qilingan' : '⚠️ Loyiha (nashr qilinmagan)'}
              </span>
            </label>
            <span className="text-xs text-blue-700">
              Nashr qilingan test natijalari ommaga ko'rinadi
            </span>
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
                            placeholder="%"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">O'quvchilar topilmadi</h3>
                <p className="text-gray-600">Bu guruhda hech qanday o'quvchi yo'q</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Link
              to={`/admin/groups/${group?._id}`}
              className="btn-secondary"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`btn-primary flex items-center space-x-2 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}