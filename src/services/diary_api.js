import api from './../Hooks/api';

// 일기 작성 ( C )
export const createDiary = async (data) => {
    const response = await api.post("/diaries/create", data);
    return response.data;
};

// 날짜별 일기 목록 조회 ( R )
export const getDiaryList = async (b_id, d_date) => {
    const response = await api.get("/diaries/list", { params: { b_id, d_date } });
    return response.data;
};

// 일기 상세 조회 ( R )
export const getDiaryDetail = async (d_id) => {
    const response = await api.get(`/diaries/${d_id}`);
    return response.data;
};

// 일기 수정 ( U )
export const editDiary = async (d_id, data) => {
    const response = await api.put(`/diaries/edit/${d_id}`, data);
    return response.data;
};

// 일기 삭제 ( D )
export const deleteDiary = async (d_id) => {
    console.log("삭제할 d_id :", d_id);

    const response = await api.delete("/diaries/del", {
        params: { d_id }
    });

    return response.data;
};