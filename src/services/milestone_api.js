import api from "../Hooks/api";

// 특정 개월수와 카테고리에 맞는 마일스톤 조회
export const getMilestones = async (months, category) => {
  const response = await api.get("/milestones/list", {
    params: {
      months,
      category,
    },
  });
  return response.data;
};

// 사용자가 마일스톤 달성 체크
export const checkMilestone = async (b_id, milestone_id, is_achieved) => {
  const response = await api.post("/milestones/check", {
    b_id,
    milestone_id,
    is_achieved,
  });
  return response.data;
};