import api from "../hooks/api";

// ------------------------------------------------------------------
// 이 파일의 엔드포인트들은 JSON이 아니라 이미지 파일(바이너리)을 그대로
// 응답합니다. 그래서 다른 api.js 함수들처럼 response.data를 반환하는 게
// 아니라, <img src="..."> 에 바로 넣을 수 있는 "URL 문자열"을 만들어줍니다.
//
// 이 엔드포인트들은 로그인 쿠키가 있어야 통과되는데, <img src> 요청은
// 브라우저가 same-site 쿠키를 자동으로 실어서 보내주기 때문에
// 별도 axios 호출 없이 이 URL을 그대로 써도 됩니다.
// ------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 성장 일기 사진 URL 생성
// 사용 예: <img src={getGrowthPhotoUrl(image.i_id)} />
export const getGrowthPhotoUrl = (i_id) => {
    return `${API_BASE_URL}/secure-images/growth/${i_id}`;
};

// 아이 프로필 사진 URL 생성
// 사용 예: <img src={getBabyProfilePhotoUrl(baby.b_id)} />
export const getBabyProfilePhotoUrl = (b_id) => {
    return `${API_BASE_URL}/secure-images/baby/${b_id}/profile`;
};

// 내 프로필 사진 URL 생성 (파라미터 없음, 로그인한 본인 사진 고정)
// 사용 예: <img src={getMyProfilePhotoUrl()} />
export const getMyProfilePhotoUrl = () => {
    return `${API_BASE_URL}/secure-images/user/profile`;
};

// ------------------------------------------------------------------
// 아래는 <img src>가 아니라, 코드에서 직접 이미지 바이너리가 필요한
// 경우(예: 다운로드 버튼, blob으로 가공 후 표시 등)를 위한 axios 버전입니다.
// 평소 화면에 사진을 띄울 때는 위의 URL 생성 함수만 쓰면 충분합니다.
// ------------------------------------------------------------------

// 성장 일기 사진을 blob으로 직접 가져오기
export const fetchGrowthPhotoBlob = async (i_id) => {
    const response = await api.get(`/secure-images/growth/${i_id}`, {
        responseType: "blob",
    });
    return URL.createObjectURL(response.data);
};

// 아이 프로필 사진을 blob으로 직접 가져오기
export const fetchBabyProfilePhotoBlob = async (b_id) => {
    const response = await api.get(`/secure-images/baby/${b_id}/profile`, {
        responseType: "blob",
    });
    return URL.createObjectURL(response.data);
};

// 내 프로필 사진을 blob으로 직접 가져오기
export const fetchMyProfilePhotoBlob = async () => {
    const response = await api.get("/secure-images/user/profile", {
        responseType: "blob",
    });
    return URL.createObjectURL(response.data);
};

// 공동 양육자(다른 사용자)의 프로필 사진을 blob으로 가져오기
export const fetchPartnerProfilePhotoBlob = async (target_u_id) => {
    const response = await api.get(`/secure-images/user/${target_u_id}/profile`, {
        responseType: "blob",
    });
    return URL.createObjectURL(response.data);
};

// 경로 문자열 자체가 저장된 경우 (예: Diary.d_image) blob으로 가져오기
// path 예시: "images/10/20260720/uuid.png" ("../"나 앞 슬래시가 섞여 있어도 됨,
// 백엔드에서 정규화/검증함)
export const fetchImageByPathBlob = async (path) => {
    const response = await api.get("/secure-images/by-path", {
        params: { path },
        responseType: "blob",
    });
    return URL.createObjectURL(response.data);
};