import { useState, useEffect } from "react";
import { getCurrentUser } from "../../Services/user_api";
import Partner_invite from "../../Components/Partner/Partner_Invite";
import Alarm_list from "../../Components/Alarm/Alarm_list";
import Partner_list from "../../Components/Partner/Partner_list";
import My_page from "../../Components/User/My_page";
import User_edit_profile from "../../Components/User/Edit_profile";
import Baby_list from "../../Components/Baby/Baby_list";
import Baby_add from "../../Components/Baby/Baby_add";
import Baby_edit_profile from "../../Components/Baby/Edit_profile";
import useAuth from "../../Hooks/useAuth";

function MyPage() {
  const { my_id } = useAuth();
  const [user, setUser] = useState(null);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [editingBaby, setEditingBaby] = useState(null);

  // 유저 정보 + 아이 목록 한 번에 조회
  const fetchCurrentUser = async () => {
    try {
      const result = await getCurrentUser(my_id);
      console.log(result);
      setUser(result.user);
      setBabies(result.baby || []);

      if (result.baby && result.baby.length > 0) {
        setSelectedBabyId(result.baby[0].b_id);
      }
    } catch (error) {
      console.log(error);
      alert("유저 정보 확인에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (my_id) {
      fetchCurrentUser();
    }
  }, [my_id]);

  // 아이 수정 버튼 클릭 → 해당 baby 객체로 수정창 오픈
  const handleEditBaby = (b_id) => {
    const target = babies.find((baby) => baby.b_id === b_id);
    setEditingBaby(target);
  };

  return (
    <div>
      <div>
        <Alarm_list />
      </div>

      {/* 내 정보 + 로그아웃 + 프로필 수정 버튼 */}
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

        <Baby_add />
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
    </div>
  );
}

export default MyPage;