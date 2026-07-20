import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiaryDetail } from "../../services/diary_api";
<<<<<<< HEAD
import SecureImage from "../common/SecureImage";
=======
import { useModal } from "../../hooks/useModal";

// ★ 백엔드 주소 설정 (환경변수 로드, 로컬 테스트용 기본값 지정)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
>>>>>>> origin/chicken

function Diary_detail() {
    const navigate = useNavigate();
    const { d_id } = useParams();   
    const { showAlert } = useModal();
    const [diary, setDiary] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const result = await getDiaryDetail(d_id);
                console.log(result);
                setDiary(result);
            } catch (error) {
                console.log(error);
                showAlert("일기 조회에 실패하였습니다.", "error");
                navigate("/diary");
            }
        };
        fetchDetail();
    }, [d_id]);

    return (
        <div className="diary-detail-wrap">
            <h2>일기 상세 조회</h2>

            {diary && (
                <div className="diary-detail-card">
                    {/* 1. 헤더 영역 (감정 칩 + 작성일) */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        {diary.d_label && (
                            <span className="diary-label-chip" style={{ margin: 0 }}>✨ {diary.d_label}</span>
                        )}
                        <span style={{ fontSize: "13px", color: "var(--text-hint)", fontWeight: "600" }}>
                            {diary.d_date ? diary.d_date.split("T")[0] : ""}
                        </span>
                    </div>

                    {/* 2. 제목 */}
                    <h3>{diary.d_title}</h3>

                    {/* 3. 아기 컴포넌트 성장 사진이 업로드 되어있을 경우 이미지 뷰어 바인딩 */}
                    {/* ★ 변경 포인트: 인증된 요청(SecureImage)으로 사진을 가져와 표시 */}
                    {diary.d_image && (
                        <div style={{ width: "100%", maxHeight: "280px", overflow: "hidden", borderRadius: "var(--radius-md)", margin: "14px 0", border: "1px solid var(--color-border)" }}>
                            <SecureImage
                                path={diary.d_image}
                                alt="아기 일기 성장 스냅샷"
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                        </div>
                    )}

                    {/* 4. 본문 내용 */}
                    <p style={{ whiteSpace: "pre-wrap", color: "var(--text-main)", marginBottom: "20px" }}>
                        {diary.d_content}
                    </p>

                    {/* 5. 활성화된 육아 활동 상태 요약 스탯 행 */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", borderTop: "1px solid var(--color-border)", paddingTop: "14px", marginTop: "14px" }}>
                        {diary.d_eat && diary.d_eat !== "없음" && (
                            <span className="chip-eat" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", padding: "6px 12px", borderRadius: "999px", marginRight: "4px", backgroundColor: "#FFF3CD", color: "#856404" }}>
                                🍼 식사 {diary.d_eat}
                            </span>
                        )}
                        {diary.d_sleep && diary.d_sleep !== "없음" && (
                            <span className="chip-sleep">💤 수면 {diary.d_sleep}</span>
                        )}
                        {diary.d_toilet && diary.d_toilet !== "없음" && (
                            <span className="chip-toilet">💩 배변 {diary.d_toilet}</span>
                        )}
                        {diary.d_temp && diary.d_temp !== "없음" && (
                            <span className="chip-temp">🌡️ 체온 {diary.d_temp}</span>
                        )}
                    </div>
                </div>
            )}

            <button onClick={() => navigate("/diary")}>목록으로</button>

            
            <button type="button" onClick={() => navigate(`/diary/edit/${d_id}`)}>수정</button>
            
        </div>
    );
}

export default Diary_detail;