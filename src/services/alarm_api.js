import api from "../Hooks/api";

// 알람 생성
export const createAlarm = async ({ send_id, receive_id }) => {
  const response = await api.post(
    "/alarms/create",
    null,
    {
      params: {
        send_id,
        receive_id,
      },
    }
  );

  return response.data;
};

// 알람 목록
export const getAlarm = async (receive_id) => {
  const response = await api.get("/alarms/list", {
    params: {
      receive_id,
    },
  });

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