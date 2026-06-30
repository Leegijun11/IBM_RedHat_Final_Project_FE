import api from "../hooks/api";

// 생성
export const createEBook = async (story) => {
    const response = await api.post("/stories/create", story);
    return response.data;
};

// 목록
export const getEBook = async (b_id) => {
    const response = await api.get("/stories/list", {
        params: { b_id }
    });
    return response.data;
};

// 상세
export const getEBookDetail = async (s_id) => {
    const response = await api.get(`/stories/${s_id}`);
    return response.data;
};

// 삭제
export const deleteEBook = async (s_id) => {
    const response = await api.delete(`/stories/del/${s_id}`);
    return response.data;
};