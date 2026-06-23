import api from "../hooks/api";

export const createEBook = async () => { // 매개변수 뭘 받아야하지
    const response = await api.post("/stories/create",)
    return response.data;
}

export const getEBook = async (u_id) => {
    const response = await api.get("/stories/list",{ params : {u_id}})
    return response.data;
}

export const getEBookDetail = async (s_id) => {
    const response = await api.get(`/stories/${s_id}`)
    return response.data;
}

export const deleteEBook = async (s_id) => {
    const response = await api.delete("/stories/del",{data : {s_id}});
    return response.data;
}