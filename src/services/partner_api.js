import api from "./api";

// 공동 양육자 등록 ( C )
export const createPartner = async (u_id) => {
const response = await api.post("/partners/add", {
u_id,
});

return response.data;
};

// 공동 양육자 목록 ( R )
export const getPartnerList = async (u_id) => {
const response = await api.get("/partners/list", {
params: { u_id },
});

return response.data;
};

// 공동 양육자 삭제 ( D )
export const deletePartner = async (u_id) => {
const response = await api.delete("/partners/del", {
data: { u_id },
});

return response.data;
};
