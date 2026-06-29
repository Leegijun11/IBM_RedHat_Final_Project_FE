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

function MyPage() {
  const [user, setUser] = useState(null);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [editingBaby, setEditingBaby] = useState(null);

  // 유저 정보 + 아이 목록 조회
  const fetchCurrentUser = async () => {
    try {
      const userResult = await getMe();
      console.log(userResult);
      setUser(userResult);

      const babyResult = await getBabies();
      setBabies(babyResult || []);

      try {
        const current = await getCurrentBaby();
        setSelectedBabyId(current.b_id);
      } catch (error) {
        if (babyResult && babyResult.length > 0) {
          setSelectedBabyId(babyResult[0].b_id);
        }
      }
    } catch (error) {
      console.log(error);
      alert("유저 정보 확인에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleEditBaby = (b_id) => {
    const target = babies.find((baby) => baby.b_id === b_id);
    setEditingBaby(target);
  };

  return (
    <div style={{ paddingBottom: "80px" }}>
      <div>
        <Alarm_list onAccept={fetchCurrentUser} />
      </div>

      {/* 내 정보 + 프로필 수정 버튼 */}
      <My_page user={user} onEditClick={() => setShowUserEdit(true)} />

      {showUserEdit && (
        <User_edit_profile
          user={user}
          onClose={() => setShowUserEdit(false)}
          onSuccess={fetchCurrentUser}
        />
      )}

      <hr />

      <div>
        <h3>아이 프로필 관리</h3>

        <Baby_list
          babies={babies}
          selectedBabyId={selectedBabyId}
          onSelect={setSelectedBabyId}
          onEdit={handleEditBaby}
        />

        {editingBaby && (
          <Baby_edit_profile
            baby={editingBaby}
            onClose={() => setEditingBaby(null)}
            onSuccess={fetchCurrentUser}
          />
        )}

        <Baby_add onSuccess={fetchCurrentUser} />
      </div>

      <hr />

      <div>
        <h3>공동 양육자 관리</h3>

        <Partner_list />

        {!showInvite && (
          <button onClick={() => setShowInvite(true)}>공동 양육자 초대</button>
        )}

        {showInvite && (
          <Partner_invite onClose={() => setShowInvite(false)} />
        )}
      </div>

      <hr />

      <Account_settings />

      <NaviBar />
    </div>
  );
}

export default MyPage;