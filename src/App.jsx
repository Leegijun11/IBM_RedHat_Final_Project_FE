import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login/Login';
import MyPage from './pages/MyPage/MyPage';
import Home from './pages/Home/Home';
import Photo_Gallery from './components/Home/Photo_Gallery';
import Record_Calendar from './components/Home/Record_Calendar';
import CommunityPage from './pages/Community/CommunityPage';
import CommunityCreate from './components/community/community_create';
import CommunityDetail from './components/community/community_detail';
import CommunityEdit from './components/community/community_edit';
import BabyInfoPage from './pages/BabyInfo/BabyInfoPage';
import Diary_write from "./components/Diary/Diary_write";
import Direct_Diary_write from "./components/Diary/Direct_Diary_write";
import Diary_edit from "./components/Diary/Diary_edit";
import Diary from './pages/Diary/Diary';
import EBookCreate from './pages/E-book/EBookCreate'
import EBookMainPage from './pages/E-book/EBookMainPage';
import Tip from "./pages/Tip/Tip";
import Partner from "./pages/Partner/Partner";
import { AuthProvider } from './contexts/AuthContext';
import Diary_detail from './components/Diary/Diary_detail';
import EBookDiarySelect from './pages/E-book/EBookDiarySelect';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='mypage' element={<MyPage/>}/>
        <Route path='home' element={<Home/>}/>
        <Route path="/home/gallery" element={<Photo_Gallery />} />
        <Route path="/record-calendar" element={<Record_Calendar />} />
        <Route path='community' element={<CommunityPage/>}/>
        <Route path='community/create' element={<CommunityCreate/>}/>
        <Route path='community/:f_id' element={<CommunityDetail/>}/>
        <Route path="/community/edit/:f_id" element={<CommunityEdit />} />
        <Route path='babyinfo' element={<BabyInfoPage/>}/>
        <Route path='diary' element={<Diary/>}/>
        <Route path="/diary/write" element={<Diary_write />} />
        <Route path="/diary/write/direct" element={<Direct_Diary_write />} />
        <Route path="/diary/edit/:d_id" element={<Diary_edit />} />
        <Route path='ebook' element={<EBookMainPage/>}/>
        <Route path='/ebook/create' element={<EBookCreate/>}/>
        <Route path="tips" element={<Tip />} />
        <Route path="partner" element={<Partner />} />
        <Route path='/diary/:d_id' element={<Diary_detail/>}/>
        <Route path='/ebook/select' element={<EBookDiarySelect/>}/>
      </Routes>
    </AuthProvider>
  );
};

export default App;