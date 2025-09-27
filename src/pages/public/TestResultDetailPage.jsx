import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, TrendingUp } from 'lucide-react';
import { testResultsApi } from '../../services/api';

const TestResultDetailPage = () => {
  const { id } = useParams();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestResult();
  }, [id]);

  const fetchTestResult = async () => {
    try {
      console.log('Fetching test result with ID:', id);
      const response = await testResultsApi.getById(id);
      console.log('Test result response:', response);
      
      if (response && response.data) {
        console.log('Test result data:', response.data);
        setTestResult(response.data);
      } else {
        setError('Test natijalari topilmadi');
      }
    } catch (error) {
      console.error('Error fetching test result:', error);
      console.error('Error response:', error.response);
      setError(`Test natijasini yuklashda xatolik yuz berdi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-3">Test natijalari yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !testResult) {
    console.log('Error or no test result:', { error, testResult });
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Xatolik yuz berdi</h1>
            <p className="text-gray-600 mb-4">{error || 'Test natijalari mavjud emas'}</p>
            <Link to="/test-results" className="btn-primary">
              Orqaga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sort students by score (highest first)
  console.log('Test result results:', testResult.results);
  const resultsArray = Array.isArray(testResult.results) ? testResult.results : [];
  const sortedResults = [...resultsArray].sort((a, b) => b.score - a.score);
  console.log('Sorted results:', sortedResults);
  
  // Check if there are any results
  if (resultsArray.length === 0) {
    console.log('No results found for this test');
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/test-results" className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Orqaga
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Test natijalari - {testResult.testName}
          </h1>
        </div>

        {/* Excel-style Results Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-600">
            <h2 className="text-xl font-bold text-white text-center">
              #{testResult.group.subject.name} {testResult.group.name}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-2 py-2 text-center text-xs font-bold text-gray-700 w-12">
                    O'rin
                  </th>
                  <th className="border border-gray-400 px-2 py-2 text-center text-xs font-bold text-gray-700 w-32">
                    Ism familya
                  </th>
                  <th className="border border-gray-400 px-2 py-2 text-center text-xs font-bold text-gray-700 w-24">
                    Maktab
                  </th>
                  <th className="border border-gray-400 px-2 py-2 text-center text-xs font-bold text-gray-700 w-16">
                    Sinf
                  </th>
                  <th className="border border-gray-400 px-2 py-2 text-center text-xs font-bold text-gray-700 w-16">
                    Test {testResult.results[0]?.maxScore || 60}
                  </th>
                  <th className="border border-gray-400 px-2 py-2 text-center text-xs font-bold text-gray-700 w-16">
                    Foiz
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => (
                  <tr key={result.student._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs font-medium">
                      {index + 1}
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-xs">
                      {result.student.firstName} {result.student.lastName}
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                      {result.student.school}
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                      {result.student.grade}
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs font-semibold">
                      {result.score}
                    </td>
                    <td className={`border border-gray-400 px-2 py-2 text-center text-xs font-bold ${
                      result.percentage >= 80 ? 'text-green-600' :
                      result.percentage >= 70 ? 'text-blue-600' :
                      result.percentage >= 60 ? 'text-yellow-600' :
                      result.percentage >= 50 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {result.percentage}%
                    </td>
                  </tr>
                ))}
                {/* Empty rows for spacing if needed */}
                {sortedResults.length < 10 && Array.from({ length: 10 - sortedResults.length }).map((_, index) => (
                  <tr key={`empty-${index}`} className={(sortedResults.length + index) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                      {sortedResults.length + index + 1}
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-xs">
                      &nbsp;
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                      &nbsp;
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                      &nbsp;
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                      &nbsp;
                    </td>
                    <td className="border border-gray-400 px-2 py-2 text-center text-xs">
                      0%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Excel-style footer */}
          <div className="bg-gray-200 px-4 py-2 border-t border-gray-400">
            <div className="text-center text-sm font-medium text-gray-700">
              Лист1 &nbsp;&nbsp;&nbsp; ⊕
            </div>
          </div>
        </div>

        {testResult.description && (
          <div className="card p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tavsif</h3>
            <p className="text-gray-700">{testResult.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultDetailPage;