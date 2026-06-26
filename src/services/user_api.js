import api from "../Hooks/api";

// 회원가입
export const signupUser = async (data) => {
    const response = await api.post("/users/signup", data);
    return response.data;
};

// 로그인
export const loginUser = async (data) => {
    const response = await api.post("/users/login", data);
    return response.data;
};

// 로그아웃
export const logoutUser = async () => {
    const response = await api.post("/users/logout");
    return response.data;
};

// 현재 사용자 정보 조회
export const getCurrentUser = async () => {
    const response = await api.get("/users/me");
    return response.data;
};

// 다른 사용자 정보 조회
export const getUserById = async (u_id) => {
    const response = await api.get(`/users/${u_id}`);
    return response.data;
};

// 아이디 찾기
export const findAccount = async ({
    u_name,
    u_email,
    u_phone,
}) => {
    const response = await api.get("/users/find_account", {
        params: {
            u_name,
            u_email,
            u_phone,
        },
    });

    return response.data;
};

// 회원정보 수정
export const updateUser = async (data) => {
    const response = await api.put("/users/edit", data);
    return response.data;
};

// 회원탈퇴
export const deleteUser = async () => {
    const response = await api.delete("/users/del");
    return response.data;
};

// 아이디(u_account)로 사용자 검색
export const searchUser = async (u_account) => {
    const response = await api.get("/users/search", {
        params: {
            u_account,
        },
    });

    return response.data;
};