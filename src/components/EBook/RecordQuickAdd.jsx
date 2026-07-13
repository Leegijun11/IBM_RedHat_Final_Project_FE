// components/EBook/RecordQuickAdd.jsx
import { useState } from "react";
import { createRecord } from "../../services/record_api";
import "../../styles/RecordQuickAdd.css";

function RecordQuickAdd({ b_id, onClose, onSuccess }) {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!b_id) {
            setError("아기 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
            return;
        }

        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (!height || !weight) {
            setError("키와 몸무게를 모두 입력해주세요.");
            return;
        }
        if (Number.isNaN(h) || Number.isNaN(w) || h <= 0 || w <= 0) {
            setError("키와 몸무게는 0보다 큰 숫자로 입력해주세요.");
            return;
        }
        if (h > 300 || w > 150) {
            setError("입력하신 수치를 다시 확인해주세요.");
            return;
        }

        setSaving(true);
        try {
            await createRecord({
                b_id,
                r_height: h,
                r_weight: w,
            });
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.error(err);
            setError("저장 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="record-quickadd-overlay" onClick={onClose}>
            <div className="record-quickadd-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="record-quickadd-title">오늘의 성장 기록</h2>

                <form className="record-quickadd-form" onSubmit={handleSubmit}>
                    <label className="record-quickadd-label">
                        키 (cm)
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.1"
                            placeholder="예) 68.5"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            disabled={saving}
                        />
                    </label>

                    <label className="record-quickadd-label">
                        몸무게 (kg)
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.1"
                            placeholder="예) 8.2"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            disabled={saving}
                        />
                    </label>

                    {error && <p className="record-quickadd-error">{error}</p>}

                    <div className="record-quickadd-btn-row">
                        <button
                            type="button"
                            className="record-quickadd-cancel-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="record-quickadd-save-btn"
                            disabled={saving}
                        >
                            {saving ? "저장 중..." : "저장"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RecordQuickAdd;