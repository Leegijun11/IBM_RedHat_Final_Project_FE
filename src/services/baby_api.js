import api from "../hooks/api";


export const createBaby = async (babyData) => {
    const response = await api.post("/babies/create", babyData);
    return response.data;
};


export const getBabies = async (u_id) => {
    const response = await api.get("babies/list", {params : {u_id}});
    return response.data;
}

export const getBabyDetail = async (b_id) => {
    const response = await api.get(`/babies/${b_id}`);
    return response.data;
}

export const updateBaby = async (babyData) => {
    const response = await api.put("/babies/edit", babyData);
    return response.data;
}

export const deleteBaby = async (b_id) => {
    const response = await api.delete("/babies/del", {data : {b_id}});
    return response.data;
}

export const createBabyPersonality = async (personalityData) =>{
    const response = await api.post("/babies/personality/create",personalityData);
    return response.data;
}