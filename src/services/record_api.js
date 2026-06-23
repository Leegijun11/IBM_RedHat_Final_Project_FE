import api from "../hooks/api";

export const createRecord = async (recordData) => {
    const response = await api.post("/records/create", recordData)
    return response.data;
}


export const getRecord = async (b_id) => {
    const response = await api.get("/records/list",{ params : {b_id}})
    return response.data;
}

//export const editRecord = async (r_id) => {
//  쓸지 모르겠음    
//}

export const deleteRecord = async (r_id) => {
    const response = await api.delete("/records/del", {data : {r_id}});
    return response.data;
}

