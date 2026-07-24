import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiaryDetail } from "../../services/diary_api";
import { useModal } from "../../hooks/useModal";
import SecureImage from "../common/SecureImage";

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
                            <span className="diary-label-chip" style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                {/* 🌟 기존 ✨ 이모지 대체 */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                                </svg>
                                {diary.d_label}
                            </span>
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
                                {/* 🌟 기존 🍼 대체 (수저 아이콘) */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 2c-1.7 0-3 1.8-3 4 0 2 1.3 3.5 2.5 3.9V22"/>
                                    <path d="M8 2c1.7 0 3 1.8 3 4 0 2-1.3 3.5-2.5 3.9"/>
                                    <line x1="15" y1="2" x2="15" y2="22"/>
                                    <line x1="19" y1="2" x2="19" y2="22"/>
                                </svg>
                                식사 {diary.d_eat}
                            </span>
                        )}
                        {diary.d_sleep && diary.d_sleep !== "없음" && (
                            <span className="chip-sleep" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                {/* 🌟 기존 💤 대체 (달 아이콘) */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                                수면 {diary.d_sleep}
                            </span>
                        )}
                        {diary.d_toilet && diary.d_toilet !== "없음" && (
                            <span className="chip-toilet" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                {/* 🌟 기존 💩 대체 (귀여운 똥 아이콘) */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2C8 2 8 7 8 7c-2 0-3 1.5-3 3 0 1.3 1 2.5 2 3-1.5.5-3 2-3 4 0 2.5 3 4 8 4s8-1.5 8-4c0-2-1.5-3.5-3-4 1-.5 2-1.7 2-3 0-1.5-1-3-3-3 0 0 0-5-4-5z"/>
                                </svg>
                                배변 {diary.d_toilet}
                            </span>
                        )}
                        {diary.d_temp && diary.d_temp !== "없음" && (
                            <span className="chip-temp" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                {/* 🌟 기존 🌡️ 대체 (온도계 아이콘) */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                                    <path d="M12 12v3"/>
                                </svg>
                                체온 {diary.d_temp}
                            </span>
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