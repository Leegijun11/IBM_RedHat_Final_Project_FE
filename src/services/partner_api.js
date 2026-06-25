import api from "../Hooks/api";


// 공동육아 목록
export const getPartnerList = async (u_id) => {
  try {
    console.log("요청 u_id =", u_id);

    const response = await api.get("/parents/list", {
      params: {
        u_id,
      },
    });

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
