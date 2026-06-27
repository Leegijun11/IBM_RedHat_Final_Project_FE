import api from "../hooks/api";


export const createBaby = async (babyData) => {
    const response = await api.post("/babies/create", babyData);
    return response.data;
};


export const getBabies = async () => {
    const response = await api.get("/babies/list");
    return response.data;
}

export const getBabyDetail = async (b_id) => {
    const response = await api.get(`/babies/${b_id}`);
    return response.data;
}

export const updateBaby = async (b_id, babyData) => {
    const response = await api.put("/babies/edit", babyData, {
        params: { b_id },
    });
    return response.data;
}

export const deleteBaby = async (b_id) => {
    const response = await api.delete("/babies/del", {data : {b_id}});
    return response.data;
}

export const createBabyPersonality = async (personalityData) =>{
    const response = await api.post("/babycharacters/create",personalityData);
    return response.data;
}

export const uploadBabyImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/babies/upload_image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { image_url: "..." }
};