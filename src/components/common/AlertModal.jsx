import "../../styles/AlertModal.css";

export default function AlertModal({ message, onConfirm, onCancel, showCancel }) {
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal-card">
        <div className="alert-modal-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="checkGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#F57E5C" />
                  <stop offset="100%" stopColor="#F5A579" />
              </linearGradient>
            </defs>
            <path d="M20 6L9 17l-5-5" stroke="url(#checkGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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