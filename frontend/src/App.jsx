import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/layouts';
import ProtectedRoute from './PrivateRoute';
import { AuthProvider } from './AuthProvider'; // Import the AuthProvider component

// Lazy load your components
const Login = lazy(() => import('./pages/auth/Login/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register/Register.jsx'));
const Logout = lazy(() => import('./pages/auth/Login/Logout.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/Login/ForgotPassword.jsx'));
const CreatePassword = lazy(() => import('./pages/auth/Login/CreatePassword.jsx'));
function App() {
  return (
    <AuthProvider> {/* Wrap your Routes with the AuthProvider */}
      <Suspense fallback={<div>Loading...</div>}> {/* Suspense component to show fallback UI while loading */}
        <Routes>
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
