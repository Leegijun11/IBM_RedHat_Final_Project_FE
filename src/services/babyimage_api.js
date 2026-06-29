import api from "../hooks/api";

export const uploadBabyImage = async (b_id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/babyimages/create", formData, {
        params: { b_id },
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getBabyImages = async (b_id, i_date) => {
    const response = await api.get("/babyimages/list", {
        params: { b_id, i_date },
    });
    return response.data;
};

export const deleteBabyImage = async (i_id) => {
    const response = await api.delete("/babyimages/del", {
        params: { i_id },
    });
    return response.data;
};