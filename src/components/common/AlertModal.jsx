import "../../styles/AlertModal.css";

export default function AlertModal({ message, onConfirm, onCancel, showCancel, type = "success" }) {
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal-card">
        <div className={`alert-modal-icon icon-${type}`}>
          {type === "error" ? (
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#D9534F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : type === "confirm" ? (
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 2-2.5 3.5M12 17h.01" stroke="#F57E5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="checkGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#F57E5C" />
                  <stop offset="100%" stopColor="#F5A579" />
                </linearGradient>
              </defs>
              <path d="M20 6L9 17l-5-5" stroke="url(#checkGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
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