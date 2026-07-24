import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentBaby } from "../../services/partner_api";
import { useModal } from "../../hooks/useModal";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/EBookCreate.css";

function EBookCreate() {
    const navigate = useNavigate();
    const [bId, setBId] = useState(null);
    const [period, setPeriod] = useState({ start: "", end: "" });
    const { showAlert } = useModal(); 

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                if (!baby) {
                    showAlert("등록된 아기 정보가 없습니다.", "error");
                    navigate("/babyinfo");
                    return;
                }
                setBId(baby.b_id);
            } catch (error) {
                console.error(error);
                showAlert("로그인이 필요합니다.", "error");
                navigate("/");
            }
        };
        fetchBaby();
    }, [navigate]);

    const handleNext = () => {
        if (!period.start || !period.end) {
            showAlert("기간을 선택해주세요.", "error");
            return;
        }
        if (new Date(period.start) > new Date(period.end)) {
            showAlert("시작 날짜가 종료 날짜보다 늦을 수 없습니다.", "error");
            return;
        }

        navigate("/ebook/select", {
            state: {
                b_id: bId,
                start_date: period.start,
                end_date: period.end,
            }
        });
    };

    return (
        <div className="ebook-create-page page-container">
            <div className="create-header">
                <h2>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F07C60" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-8px", marginRight: "8px" }}>
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    디지털 북 만들기
                </h2>
                <p>원하는 기간을 선택하여 성장 디지털 북을 생성하세요.</p>
            </div>

            <div className="create-card">
                <h3>기간 선택하기</h3>

                <label className="create-label">시작 날짜</label>
                <input
                    className="date-input"
                    type="date"
                    value={period.start}
                    onChange={(e) => setPeriod({ ...period, start: e.target.value })}
                />

                <label className="create-label">종료 날짜</label>
                <input
                    className="date-input"
                    type="date"
                    value={period.end}
                    onChange={(e) => setPeriod({ ...period, end: e.target.value })}
                />

                <button className="create-submit" onClick={handleNext}>
                    다음 단계 →
                </button>
            </div>

            <NaviBar />
        </div>
    );
}

export default EBookCreate;