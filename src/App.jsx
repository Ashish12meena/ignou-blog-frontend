import { useState } from 'react'
import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
// import Profile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';
// import FullPostCard from './components/post/FullPostCard';
import Sidebar from './components/header/Sidebar';
// import AddPost from './components/post/AddPost';
// import SettingHome from './components/settings/SettingHome';
// import Explore from './pages/Explore';
// import { useEffect } from 'react';
// import { requestPermission } from './services/firebaseToken';
// import Notification from './pages/Notification';

function App() {
   return (
    <>
      <Router>
        <div className="flex">
          {/* Sidebar */}
          {/* <Sidebar /> */}

          <Sidebar />

          
          <div className="flex-1 ">
            {/* <Header />  This goes below Sidebar */}
            <Routes>
              <Route path="/home" element={<PrivateRoute element={<Home />} />} />
              {/* <Route path="/write/post" element={<PrivateRoute element={<AddPost />} />} /> */}
              <Route path="/" element={<PrivateRoute element={<Home />} />} />
              {/* <Route path="/profile/:userEmail?" element={<PrivateRoute element={<Profile />} />} /> */}
              {/* <Route path="/post" element={<PrivateRoute element={<FullPostCard />} />} /> */}
              {/* <Route path="/explore" element={<PrivateRoute element={<Explore />} />} /> */}
              {/* <Route path="/settings" element={<PrivateRoute element={<SettingHome />} />} /> */}
              {/* <Route path="/notification" element={<PrivateRoute element={<Notification />} />} /> */}
              <Route path="/start" element={<LandingPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App
