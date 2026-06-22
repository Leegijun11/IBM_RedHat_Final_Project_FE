import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login/Login';
import MyPage from './pages/MyPage/MyPage';
import Home from './pages/Home/Home';
import CommunityPage from './pages/Community/CommunityPage';
import BabyInfoPage from './pages/BabyInfo/BabyInfoPage';
import Diary from './pages/Diary/Diary';
import EbookPage from './pages/E-book/EbookPage';
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='mypage' element={<MyPage/>}/>
      <Route path='home' element={<Home/>}/>
      <Route path='community' element={<CommunityPage/>}/>
      <Route path='babyinfo' element={<BabyInfoPage/>}/>
      <Route path='diary' element={<Diary/>}/>
      <Route path='ebook' element={<EbookPage/>}/>
    </Routes>
  );
};

export default App;