import { useState, useEffect } from "react";
import { getMe } from "../../services/user_api";
import { getBabies } from "../../services/baby_api";
import { getCurrentBaby } from "../../services/partner_api";
import Partner_invite from "../../components/Partner/Partner_Invite";
import Alarm_list from "../../components/Alarm/Alarm_list";
import Partner_list from "../../components/Partner/Partner_list";
import My_page from "../../components/User/My_page";
import User_edit_profile from "../../components/User/Edit_profile";
import Baby_list from "../../components/Baby/Baby_list";
import Baby_add from "../../components/Baby/Baby_add";
import Baby_edit_profile from "../../components/Baby/Edit_profile";
import Account_settings from "../../components/User/Account_settings";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/MyPage.css";

function MyPage() {
  const [user, setUser] = useState(null);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [editingBaby, setEditingBaby] = useState(null);
  const [partnerRefreshKey, setPartnerRefreshKey] = useState(0);
  const fetchCurrentUser = async () => {
    try {
      const userResult = await getMe();
      setUser(userResult);
      const babyResult = await getBabies();
      setBabies(babyResult || []);
      try {
        const current = await getCurrentBaby();
        setSelectedBabyId(current.b_id);
      } catch (error) {
        if (babyResult && babyResult.length > 0) setSelectedBabyId(babyResult[0].b_id);
      }
      setPartnerRefreshKey((prev)=> prev + 1);
    } catch (error) {
      alert("데이터 로드에 실패했습니다.");
    }
  };

  useEffect(() => { fetchCurrentUser(); }, []);

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <Alarm_list onAccept={fetchCurrentUser} />
      </div>

      <div className="mypage-section">
        {/* 프로필 수정이 이 바로 아래로 슬라이드 다운 됩니다 */}
        <My_page user={user} onEditClick={() => setShowUserEdit(!showUserEdit)} />
        {showUserEdit && (
          <User_edit_profile
            user={user}
            onClose={() => setShowUserEdit(false)}
            onSuccess={fetchCurrentUser}
          />
        )}
      </div>

      <div className="mypage-section">
        <h3 className="section-title">아이 프로필 관리</h3>
        <Baby_list babies={babies} selectedBabyId={selectedBabyId} onSelect={setSelectedBabyId} onEdit={(b_id) => setEditingBaby(babies.find(b => b.b_id === b_id))} />
        {editingBaby && <Baby_edit_profile baby={editingBaby} onClose={() => setEditingBaby(null)} onSuccess={fetchCurrentUser} />}
        <Baby_add onSuccess={fetchCurrentUser} />
      </div>

      <div className="mypage-section">
        <h3 className="section-title">공동 양육자 관리</h3>
        <Partner_list key={partnerRefreshKey}/>
        {!showInvite && (
          <button className="invite-btn" onClick={() => setShowInvite(true)}>+ 공동 양육자 초대</button>
        )}
        {showInvite && <Partner_invite onClose={() => setShowInvite(false)} />}
      </div>

      <div className="mypage-section">
        <Account_settings />
      </div>

      <NaviBar />
    </div>
  );
}

export default MyPage;