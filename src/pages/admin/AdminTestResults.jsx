import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { testResultsApi, groupsApi } from '../../services/api';
import { Link } from 'react-router-dom';

const AdminTestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [showAllTestResults, setShowAllTestResults] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    fetchTestResults();
    fetchGroups();
  }, [currentPage, selectedGroup]);

  const fetchTestResults = async () => {
    try {
      const filters = selectedGroup ? { groupId: selectedGroup } : {};
      const response = await testResultsApi.getAll(filters, currentPage, itemsPerPage);
      
      // Handle both old and new API response formats
      if (response.data.pagination) {
        // New paginated format
        const testResultsData = Array.isArray(response.data.data) ? response.data.data : [];
        setTestResults(testResultsData);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setHasNextPage(response.data.pagination.hasNextPage);
        setHasPrevPage(response.data.pagination.hasPrevPage);
      } else {
        // Old format (fallback)
        const testResultsData = Array.isArray(response.data) ? response.data : [];
        setTestResults(testResultsData);
        setTotalPages(1);
        setTotalItems(testResultsData.length);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
      setError('Test natijalarini yuklashda xatolik yuz berdi');
      setTestResults([]);
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

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham bu test natijasini o\'chirib tashlamoqchimisiz?')) {
      try {
        await testResultsApi.delete(id);
        await fetchTestResults();
      } catch (error) {
        setError('Test natijasini o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const togglePublish = async (id) => {
    try {
      await testResultsApi.togglePublish(id);
      await fetchTestResults();
    } catch (error) {
      setError('Nashr holatini o\'zgartirishda xatolik yuz berdi');
    }
  };

  const loadMoreTestResults = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const showAllTestResultsHandler = async () => {
    setShowAllTestResults(true);
    try {
      const filters = selectedGroup ? { groupId: selectedGroup } : {};
      const response = await testResultsApi.getAll(filters, 1, totalItems);
      // Handle both old and new API response formats
      if (response.data.pagination) {
        const testResultsData = Array.isArray(response.data.data) ? response.data.data : [];
        setTestResults(testResultsData);
      } else {
        const testResultsData = Array.isArray(response.data) ? response.data : [];
        setTestResults(testResultsData);
      }
    } catch (error) {
      console.error('Error fetching all test results:', error);
      setError(error.response?.data?.message || 'Barcha test natijalarini yuklashda xatolik yuz berdi');
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
          <h1 className="text-2xl font-bold text-gray-900">Test Natijalari</h1>
          <p className="text-gray-600">Test natijalarini boshqarish va yangi natija qo'shish</p>
        </div>
        <Link to="/admin/test-results/create" className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Yangi natija qo'shish</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Test Results Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test nomi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guruh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'quvchilar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'rtacha ball
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
              {testResults.map((testResult) => (
                <tr key={testResult._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {testResult.testName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {testResult.group?.subject?.name || 'Fan nomi'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testResult.group?.name || 'Guruh nomi'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(testResult.testDate).toLocaleDateString('uz-UZ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {testResult.totalStudents || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {testResult.averageScore?.toFixed(1) || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      testResult.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {testResult.isPublished ? 'Nashr qilingan' : 'Loyiha'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/admin/test-results/${testResult._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Tahrirlash"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => togglePublish(testResult._id)}
                        className="text-gray-600 hover:text-gray-900"
                        title={testResult.isPublished ? 'Nashrdan olib tashlash' : 'Nashr qilish'}
                      >
                        {testResult.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(testResult._id)}
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
          
          {testResults.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {selectedGroup ? 'Hech narsa topilmadi' : 'Test natijalari mavjud emas'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedGroup 
                  ? 'Filterni olib tashlang yoki boshqa guruh tanlang' 
                  : 'Birinchi test natijasini qo\'shish uchun tugmani bosing'
                }
              </p>
              {!selectedGroup && (
                <div className="mt-6">
                  <Link to="/admin/test-results/create" className="btn-primary">
                    Yangi natija qo'shish
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {!showAllTestResults && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Jami: {totalItems} ta test natijasi, {currentPage}/{totalPages} sahifa
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
                    onClick={loadMoreTestResults}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Yana 10 ta yuklash
                  </button>
                )}
                {totalItems > 10 && (
                  <button
                    onClick={showAllTestResultsHandler}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Barchasini ko'rsatish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {showAllTestResults && totalItems > 10 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAllTestResults(false);
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Qisqartirilgan ko'rinish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestResults;