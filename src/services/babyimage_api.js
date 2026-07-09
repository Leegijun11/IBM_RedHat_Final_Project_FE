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

//다중 이미지 삭제 API
export const deleteMultipleBabyImage = async (i_id) => {
    const response = await api.delete("/babyimages/multi_del", {
        data: { i_ids:i_ids },
    });
    return response.data;
};

// 갤러리용 API
export const getAllBabyImages=async (b_id)=>{
    const response=await api.get("/babyimages/list_all", {
        params: {b_id}
    })
    return response.data
}


export const getMonthlyBabyImages = async (b_id, year, month) => {
    const response = await api.get("/babyimages/monthly", {
        params: { b_id, year, month },
    });
    return response.data;
};