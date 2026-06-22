import api from "../hooks/api";

// 팁 목록 ( R )
export const getTipList = async () => {
const response = await api.get("/tips/list");
return response.data;
};

// 팁 상세
export const getTipDetail = async (t_id) => {
const response = await api.get(`/tips/${t_id}`);
return response.data;
};
