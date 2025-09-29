import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from './pages/public/HomePage';
import TestResultsPage from './pages/public/TestResultsPage';
import TestResultDetailPage from './pages/public/TestResultDetailPage';
import AchievementsPage from './pages/public/AchievementsPage';
import GraduatesPage from './pages/public/GraduatesPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsManagement from './pages/admin/StudentsManagement';
import GroupsManagement from './pages/admin/GroupsManagement';
import SubjectsManagement from './pages/admin/SubjectsManagement';
import AdminTestResults from './pages/admin/AdminTestResults';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminGraduates from './pages/admin/AdminGraduates';
import GroupPanel from './pages/admin/GroupPanel';
import CreateTestResult from './pages/admin/CreateTestResult';
import EditTestResult from './pages/admin/EditTestResult';
import AdminLogin from './pages/admin/AdminLogin';

// Layout Components
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="test-results" element={<TestResultsPage />} />
            <Route path="test-results/:id" element={<TestResultDetailPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="graduates" element={<GraduatesPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentsManagement />} />
            <Route path="subjects" element={<SubjectsManagement />} />
            <Route path="subjects/:subjectId/groups" element={<GroupsManagement />} />
            <Route path="groups/:groupId" element={<GroupPanel />} />
            <Route path="groups/:groupId/test-results/create" element={<CreateTestResult />} />
            <Route path="test-results/:testResultId/edit" element={<EditTestResult />} />
            <Route path="test-results" element={<AdminTestResults />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="graduates" element={<AdminGraduates />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;