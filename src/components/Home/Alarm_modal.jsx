import { useState } from "react";

function Alarm_modal({ alarm, onAccept, onReject, onClose }) {
  if (!alarm) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        zIndex: 999,
      }}
    >
      <h2>공동 양육자 초대</h2>

      <p>공동 양육자로 초대되었습니다.</p>

      <button onClick={() => onAccept(alarm)}>
        수락
      </button>

      <button
        onClick={() => onReject(alarm)}
        style={{ marginLeft: "10px" }}
      >
        거절
      </button>

      <button
        onClick={onClose}
        style={{ marginLeft: "10px" }}
      >
        닫기
      </button>
    </div>
  );
}

export default Alarm_modal;