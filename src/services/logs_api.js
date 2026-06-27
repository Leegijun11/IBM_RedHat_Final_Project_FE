import api from "../hooks/api";

export const createOrUpdateLog = async (logData) => {
    const response = await api.post("/logs/add", logData);
    return response.data;
};

export const getLogDetail = async (l_id) => {
    const response = await api.get("/logs/detail", { params: { l_id } });
    return response.data;
};

export const deleteLog = async (l_id) => {
    const response = await api.delete("/logs/del", { params: { l_id } });
    return response.data;
};

export const getLogStreak = async (b_id) => {
    const response = await api.get("/logs/streak", { params: { b_id } });
    return response.data;
};