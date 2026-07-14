// components/EBook/RecordQuickAdd.jsx
import { useState } from "react";
import { createRecord, updateRecord, deleteRecord } from "../../services/record_api";
import "../../styles/RecordQuickAdd.css";

// editRecord가 있으면 "수정 모드", 없으면 기존과 동일한 "새 기록 추가 모드"
function RecordQuickAdd({ b_id, editRecord, onClose, onSuccess, onDeleted }) {
    const isEdit = !!editRecord;

    const [height, setHeight] = useState(isEdit ? String(editRecord.r_height) : "");
    const [weight, setWeight] = useState(isEdit ? String(editRecord.r_weight) : "");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isEdit && !b_id) {
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
            if (isEdit) {
                await updateRecord(editRecord.r_id, { r_height: h, r_weight: w });
            } else {
                await createRecord({ b_id, r_height: h, r_weight: w });
            }
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.error(err);
            setError("저장 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!editRecord) return;
        const ok = window.confirm("이 기록을 삭제할까요? 삭제하면 되돌릴 수 없어요.");
        if (!ok) return;

        setDeleting(true);
        setError("");
        try {
            await deleteRecord(editRecord.r_id);
            onDeleted?.();
            onClose?.();
        } catch (err) {
            console.error(err);
            setError("삭제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
        } finally {
            setDeleting(false);
        }
    };

    const busy = saving || deleting;

    return (
        <div className="record-quickadd-overlay" onClick={onClose}>
            <div className="record-quickadd-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="record-quickadd-title">
                    {isEdit ? "기록 수정하기" : "오늘의 성장 기록"}
                </h2>

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
                            disabled={busy}
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
                            disabled={busy}
                        />
                    </label>

                    {error && <p className="record-quickadd-error">{error}</p>}

                    <div className="record-quickadd-btn-row">
                        {isEdit && (
                            <button
                                type="button"
                                className="record-quickadd-delete-btn"
                                onClick={handleDelete}
                                disabled={busy}
                            >
                                {deleting ? "삭제 중..." : "삭제"}
                            </button>
                        )}
                        <button
                            type="button"
                            className="record-quickadd-cancel-btn"
                            onClick={onClose}
                            disabled={busy}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="record-quickadd-save-btn"
                            disabled={busy}
                        >
                            {saving ? "저장 중..." : isEdit ? "수정 완료" : "저장"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RecordQuickAdd;