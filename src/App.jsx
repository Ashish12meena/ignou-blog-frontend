import React, { Component } from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Sidebar from './components/header/Sidebar';
import AddPost from './components/post/AddPost';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ERROR BOUNDARY]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center p-8 bg-red-50 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex">
          <Sidebar />
          
          <div className="flex-1">
            <Routes>
              <Route path="/home" element={<PrivateRoute element={<Home />} />} />
              <Route path="/write/post" element={<PrivateRoute element={<AddPost />} />} />
              <Route path="/post" element={<PrivateRoute element={<FullPostCard />} />} />
              <Route path="/" element={<PrivateRoute element={<Home />} />} />
              <Route path="/start" element={<LandingPage />} />
              <Route path="/start" element={<LandingPage />} />
              
              {/* Catch-all route for 404 */}
              <Route 
                path="*" 
                element={
                  <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-700">404</h1>
                      <p className="text-gray-500 mt-2">Page not found</p>
                      <button
                        onClick={() => window.location.href = '/'}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Go Home
                      </button>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;