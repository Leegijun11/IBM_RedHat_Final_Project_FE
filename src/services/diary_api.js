import api from './../Hooks/api';

// 일기 작성 ( C )
export const createDiary = async (data) => {
    const response = await api.post("/diaries/create", data);
    return response.data;
};

// 날짜 별 일기 목록 조회 ( R )
export const getDiaryList = async (u_id, d_data) => {
    const response = await api.get("/diaries", {params : {u_id, d_data}});
    return response.data;
};

// 일기 상세 조회 ( R )
export const getDiaryDetail = async (d_id) => {
    const response = await api.get(`/diaries/${d_id}`);
    return response.data;
}

// 일기 수정 ( U )
export const editDiary = async (data) => {
    const response = await api.post("/diaries/edit", data);
    return response.data;
};

// 일기 삭제 ( D )
export const deleteDiary = async (d_id) => {
    const response = await api.delete("/diaries", {data : {d_id}});
    return response.data;
};