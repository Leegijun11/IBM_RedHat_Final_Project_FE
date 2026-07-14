import api from "../hooks/api";

export const createRecord = async (recordData) => {
    const response = await api.post("/records/create", recordData)
    return response.data;
}


export const getRecord = async (b_id) => {
    const response = await api.get("/records/list",{ params : {b_id}})
    return response.data;
}

// 백엔드 라우트: PUT /records/{r_id}  (r_id는 경로 파라미터, body엔 r_height/r_weight만)
export const updateRecord = async (r_id, recordData) => {
    const response = await api.put(`/records/${r_id}`, recordData);
    return response.data;
}

// 백엔드 라우트: DELETE /records/del  (r_id는 body가 아니라 쿼리 파라미터)
export const deleteRecord = async (r_id) => {
    const response = await api.delete("/records/del", { params: { r_id } });
    return response.data;
}