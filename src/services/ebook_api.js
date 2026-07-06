import api from "../hooks/api";

// 1. 디지털북 생성
export const createEBook = async (story) => {
    const response = await api.post("/stories/create", story);
    return response.data;
};

// 2. b_id별 디지털북 목록 조회
export const getEBook = async (b_id) => {
    const response = await api.get("/stories/list", {
        params: { b_id }
    });
    return response.data;
};

// 3. 디지털북 기본 정보 상세 조회
export const getEBookDetail = async (s_id) => {
    const response = await api.get(`/stories/${s_id}`);
    return response.data;
};

// 4. 디지털북 삭제
export const deleteEBook = async (s_id) => {
    const response = await api.delete(`/stories/del/${s_id}`);
    return response.data;
};

// 5. 디지털북 페이지 목록 조회 (이게 상세 보기 시 필수 필요!)
export const getEBookPagesList = async (s_id) => {
    const response = await api.get(`/stories/page/list/${s_id}`);
    return response.data;
};

// 6. 디지털북 페이지 단건 상세 조회
export const getEBookPageDetail = async (sp_id) => {
    const response = await api.get(`/stories/page/${sp_id}`);
    return response.data;
};

// 7.디지털북 페이지 삭제
export const deleteEBookPage = async (sp_id) => {
    const response = await api.delete(`/stories/page/del`, {
        params: { sp_id }
    });
    return response.data;
};