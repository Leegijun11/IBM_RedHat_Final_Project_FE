import api from "../hooks/api"

// 팁 목록 조회
export const getTipList = async (t_age) => {
  const response = await api.get("/tips/list", {
    params: {
      t_age,
      skip: 0,
      limit: 10,
    },
  });

  return response.data;
};

// 팁 상세 조회
export const getTipDetail = async (t_id) => {
  const response = await api.get(`/tips/${t_id}`);

  return response.data;
};
