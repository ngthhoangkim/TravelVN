import './css/App.css';
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home/Home';
import User from './pages/User/user';
import SignIn from './pages/auth/signIn';
import Local from './pages/Post/local/local';
import History from './pages/Post/history/history';
import Cultural from './pages/Post/cultural/cultural';
import { AuthContext } from './context/authContext';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/signin" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Auth Route */}
        <Route path="signin" element={<SignIn />} />

        {/* Protected Routes */}
        <Route
          path="manageUser"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="local"
          element={
            <ProtectedRoute>
              <Local />
            </ProtectedRoute>
          }
        />
        <Route
          path="history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="cultural"
          element={
            <ProtectedRoute>
              <Cultural />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
