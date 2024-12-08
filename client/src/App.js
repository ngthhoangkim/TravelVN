import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from 'react';
import SignUp from './components/auth/signUp';
import SignIn from "./components/auth/signIn";
import Home from "./components/home/home";
import ForgotPassword from "./components/auth/forgotPass";
import Location from "./components/discover/location/location";
import History from './components/discover/history/history';
import Cultural from './components/discover/cultural/cultural';
import Blog from "./components/blog/Blog.jsx";
import ProfilePage from "./components/profile/profile.jsx";
import DetailLocal from "./components/discover/location/detailLocal.jsx";
import DetailHistory from "./components/discover/history/detailHistory.jsx";
import DetailCultural from "./components/discover/cultural/detailCultural.jsx";
import DetailBlog from "./components/blog/detailBlog.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpass" element={<ForgotPassword />} />
        
        <Route path="/location" element={<Location />} />
        <Route path="/history" element={<History />} />
        <Route path="/cultural" element={<Cultural />} />
        <Route path="/blog" element={<Blog />} />
        
        <Route path="/profile" element={<ProfilePage />} />
        
        <Route path="/local/:id" element={<DetailLocal />} />
        <Route path="/history/:id" element={<DetailHistory />} />
        <Route path="/cultural/:id" element={<DetailCultural />} />
        <Route path="/blog/:id" element={<DetailBlog/>} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
