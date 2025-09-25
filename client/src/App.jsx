import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import FarmDetail from './pages/FarmDetail';
import Crops from './pages/Crops';
import CropDetail from './pages/CropDetail';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
      />
      <Route
        path="/farms"
        element={user ? <Layout><Farms /></Layout> : <Navigate to="/login" />}
      />
      <Route
        path="/farms/:id"
        element={user ? <Layout><FarmDetail /></Layout> : <Navigate to="/login" />}
      />
      <Route
        path="/crops"
        element={user ? <Layout><Crops /></Layout> : <Navigate to="/login" />}
      />
      <Route
        path="/crops/:id"
        element={user ? <Layout><CropDetail /></Layout> : <Navigate to="/login" />}
      />
      <Route
        path="/weather"
        element={user ? <Layout><Weather /></Layout> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={user ? <Layout><Profile /></Layout> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;