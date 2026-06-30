import api from "../hooks/api"

// 알람 생성
export const createAlarm = async ({ receive_account }) => {
    const response = await api.post("/alarms/create", null, {
        params: { receive_account },
    });
    return response.data;
};

// 알람 목록
export const getAlarm = async () => {
  const response = await api.get("/alarms/list");

  return response.data;
};

// 알람 삭제
export const deleteAlarm = async (a_id) => {
  const response = await api.delete("/alarms/delete", {
    params: {
      a_id,
    },
  });

  return response.data;
};

// 전체 삭제
export const deleteAllAlarm = async (receive_id) => {
  const response = await api.delete("/alarms/all_del", {
    params: {
      receive_id,
    },
  });

  return response.data;
};