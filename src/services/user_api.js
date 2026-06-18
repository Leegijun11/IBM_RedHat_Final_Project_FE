import api from "./api";

// 회원가입 ( C )
export const signupUser = async (userData) => {
  const response = await api.post("/users/signup", userData);
  return response.data;
};

// 로그인
export const loginUser = async (loginData) => {
  const response = await api.post("/users/login", loginData);
  return response.data;
};

// 로그아웃
export const logoutUser = async (u_id) => {
  const response = await api.post("/users/logout", {
    u_id,
  });

  return response.data;
};

// 현재 유저 조회 ( R )
export const getCurrentUser = async (u_id) => {
  const response = await api.get("/users/me", {
    params: {
      u_id,
    },
  });

  return response.data;
};

// 다른 유저 조회
export const getUserById = async (u_id) => {
  const response = await api.get(`/users/${u_id}`);

  return response.data;
};

// 아이디 찾기
export const findAccount = async (data) => {
  const response = await api.get("/users/find_account", {
    params: data,
  });

  return response.data;
};

// 비밀번호 찾기
export const findPassword = async (data) => {
  const response = await api.get("/users/find_pw", {
    params: data,
  });

  return response.data;
};

// 유저 정보 수정 ( U )
export const updateUser = async (userData) => {
  const response = await api.put("/users/edit", userData);

  return response.data;
};

// 유저 삭제 ( D )
export const deleteUser = async (u_id) => {
  const response = await api.delete("/users/del", {
    data: {
      u_id,
    },
  });

  return response.data;
};