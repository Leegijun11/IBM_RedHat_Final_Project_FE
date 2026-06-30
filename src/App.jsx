import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login/Login';
import MyPage from './pages/MyPage/MyPage';
import Home from './pages/Home/Home';
import CommunityPage from './pages/Community/CommunityPage';
import BabyInfoPage from './pages/BabyInfo/BabyInfoPage';
import Diary_write from "./components/Diary/Diary_write";
import Diary from './pages/Diary/Diary';
import EBookCreate from './pages/E-book/EBookCreate'
import EBookMainPage from './pages/E-book/EBookMainPage';
import Tip from "./pages/Tip/Tip";
import Partner from "./pages/Partner/Partner";
import { AuthProvider } from './contexts/AuthContext';
import Diary_detail from './components/Diary/Diary_detail';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='mypage' element={<MyPage/>}/>
        <Route path='home' element={<Home/>}/>
        <Route path='community' element={<CommunityPage/>}/>
        <Route path='babyinfo' element={<BabyInfoPage/>}/>
        <Route path='diary' element={<Diary/>}/>
        <Route path="/diary/write" element={<Diary_write />} />
        <Route path='ebook' element={<EBookMainPage/>}/>
        <Route path='/ebook/create' element={<EBookCreate/>}/>
        <Route path="tips" element={<Tip />} />
        <Route path="partner" element={<Partner />} />
        <Route path='/diary/:d_id' element={<Diary_detail/>}/>
      </Routes>
    </AuthProvider>
  );
};

export default App;