import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/UserManagement/Login';
import Register from './pages/UserManagement/Register';
import ForgotPassword from './pages/UserManagement/ForgotPassword';
import ResetPassword from './pages/UserManagement/ResetPassword';
import NavigationBar from './components/NavigationBar/NavigationBar';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Home from './pages/Home/Home';
import CreatePostPage from './pages/CreatePost/CreatePostPage';
import ConnectionsPage from './pages/ConnectionsPage/ConnectionsPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import SearchPage from './pages/SearchPage/SearchPage';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import WorkoutPlanList from './pages/WorkoutPlans/WorkoutPlanList';
import WorkoutPlanDetail from './pages/WorkoutPlans/WorkoutPlanDetail';
import WorkoutPlanForm from './components/WorkoutPlan/WorkoutPlanForm';
import CreateEditWorkoutPlan from './pages/WorkoutPlans/CreateEditWorkoutPlanPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/profile/:id" element={<UserProfilePage />} />
            <Route path="/search" element={<SearchPage />} />

            <Route path="/workout-plans" element={<WorkoutPlanList />} />
            <Route path="/workout-plans/create" element={<CreateEditWorkoutPlan />} />
            <Route path="/workout-plans/:id" element={<WorkoutPlanDetail />} />
            <Route path="/workout-plans/:id/edit" element={<CreateEditWorkoutPlan />} />
            <Route path="/workout-plans-form" element={<WorkoutPlanForm />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;