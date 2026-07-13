import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createEBook } from "../../services/ebook_api";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/EBookCreate.css";

// 미달성 일기 목록 API (service_stories_diaries_select 호출)
import api from "../../hooks/api";

const getSelectableDiaries = async (b_id) => {
    const response = await api.get("/stories/select_diaries", {
        params: { b_id }
    });
    return response.data;
};

function EBookDiarySelect() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { b_id, start_date, end_date } = state || {};

    const [diaries, setDiaries] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!b_id) {
            navigate("/ebook/create");
            return;
        }

        const fetchDiaries = async () => {
            try {
                const result = await getSelectableDiaries(b_id);
                setDiaries(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error(error);
                setDiaries([]);
            }
        };
        fetchDiaries();
    }, [b_id]);

    const toggleSelect = (d_id) => {
        setSelectedIds((prev) =>
            prev.includes(d_id)
                ? prev.filter((id) => id !== d_id)
                : [...prev, d_id]
        );
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            await createEBook(
                {
                    b_id,
                    start_date,
                    end_date,
                    s_fcover: "",
                    s_bcover: "",
                    s_creator: "",
                    s_comment: "",
                },
                selectedIds
            );
            alert("디지털북이 생성되었습니다!");
            navigate("/ebook");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || "생성에 실패했습니다.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ebook-create-page">
            <div className="create-header">
                <h2>📖 일기 추가 선택</h2>
                <p>마일스톤 미달성 일기 중 책에 포함할 일기를 선택하세요. (선택 안 해도 됩니다)</p>
            </div>

            <div className="create-card">
                {diaries.length === 0 ? (
                    <p style={{ color: "#A3968C", textAlign: "center" }}>
                        추가 가능한 일기가 없습니다.
                    </p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {diaries.map((diary) => (
                            <li
                                key={diary.d_id}
                                onClick={() => toggleSelect(diary.d_id)}
                                style={{
                                    padding: "12px 16px",
                                    marginBottom: "10px",
                                    borderRadius: "12px",
                                    border: selectedIds.includes(diary.d_id)
                                        ? "2px solid #F07C60"
                                        : "1px solid #EAE2DB",
                                    background: selectedIds.includes(diary.d_id)
                                        ? "#FFF5F0"
                                        : "#FAF4EF",
                                    cursor: "pointer",
                                }}
                            >
                                <p style={{ fontWeight: 700, color: "#5D5046", margin: "0 0 4px" }}>
                                    {diary.d_title}
                                </p>
                                <p style={{ fontSize: 12, color: "#A3968C", margin: 0 }}>
                                    {diary.d_date?.substring(0, 10)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                <p style={{ fontSize: 13, color: "#A3968C", marginBottom: 16 }}>
                    선택한 일기: {selectedIds.length}개
                </p>

                <button
                    className="create-submit"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {loading ? "생성 중..." : "📖 디지털북 생성하기"}
                </button>
            </div>

            <NaviBar />
        </div>
    );
}

export default EBookDiarySelect;