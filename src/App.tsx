import React from 'react';
import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/Login';
import ProtectedRoute from './ProtectedRoute';
import getRouteConfigs from './routeConfig';
import Header from './components/Header/Header';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
            {
              getRouteConfigs().map((route) => (
                <Route 
                  key={route.id} 
                  path={route.path} 
                  element={
                    <ProtectedRoute>
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <route.component />
                      </React.Suspense>
                    </ProtectedRoute>
                  } 
                />
              ))
            }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
