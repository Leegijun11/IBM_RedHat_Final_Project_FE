import api from "../hooks/api";

export const createAlarm = async (alarmData) => {
  const response = await api.post("/alarm/create", alarmData); 
  return response.data;
};

export const getAlarm = async (receive_id) => {
  const response = await api.get("/alarm/list", { params: { receive_id } }); 
  return response.data;
};

export const deleteAlarm = async (a_id) => {
  const response = await api.delete("/alarm/delete", { data: { a_id } }); 
  return response.data;
};