import { getImageUrl } from "../../hooks/imageUrl";

function My_page({ user, onEditClick }) {
  return (
    <div>
      <h2>마이페이지</h2>

      {user && (
        <>
          {user.u_image && (
            <img
              src={getImageUrl(user.u_image)}
              alt="프로필"
              width="80"
              height="80"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          )}
          <p>아이디 : {user.u_account}</p>
          <p>이름 : {user.u_name}</p>
          <p>닉네임 : {user.u_nickname}</p>
          <p>이메일 : {user.u_email}</p>
          <p>전화번호 : {user.u_phone}</p>
        </>
      )}

      <button onClick={onEditClick}>프로필 수정</button>
    </div>
  );
}

export default My_page;