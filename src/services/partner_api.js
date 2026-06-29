import api from "../Hooks/api";

// 공동육아 목록
export const getPartnerList = async () => {
  try {
    const response = await api.get("/parents/list");

    console.log("응답 데이터 =", response.data);

    return response.data;
  } catch (error) {
    console.error("API 에러", error);
    console.error("응답", error.response);

    throw error;
  }
};

// 공동육아 등록
export const createPartner = async (data) => {
  const response = await api.post("/parents/add", data);
  return response.data;
};

// 공동육아 삭제
export const deletePartner = async (p_id) => {
  const response = await api.delete("/parents/del", {
    params: {
      p_id,
    },
  });

  return response.data;
};

// 공동육아 찾기
export const findPartner = async (u_id, g_id) => {
  const response = await api.get("/parents/find", {
    params: {
      u_id,
      g_id,
    },
  });

  return response.data;
};

// 공동육아 수정
export const updatePartner = async (p_id, data) => {
  const response = await api.post(`/parents/${p_id}`, data);
  return response.data;
};

// 현재 아이 설정
export const setCurrentBaby = async (b_id) => {
  const response = await api.put("/parents/current_baby", null, {
    params: { b_id },
  });

  return response.data;
};

// 현재 아이 조회
export const getCurrentBaby = async () => {
  const response = await api.get("/parents/current_baby");
  return response.data;
};