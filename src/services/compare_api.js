import api from "../hooks/api"; 
export const getBabyStandard = async (sex, month) => {
    const response = await api.get("/standards", {
        params: { sex, month },
    });
    return response.data;
};