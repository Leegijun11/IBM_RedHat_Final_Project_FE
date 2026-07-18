import "../../styles/AlertModal.css";

export default function AlertModal({ message, onConfirm, onCancel, showCancel }) {
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal-card">
        <p className="alert-modal-message">{message}</p>
        <div className="alert-modal-btn-row">
          {showCancel && (
            <button className="alert-modal-cancel-btn" onClick={onCancel}>
              취소
            </button>
          )}
          <button className="alert-modal-confirm-btn" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}