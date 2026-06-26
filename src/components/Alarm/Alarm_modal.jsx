function Alarm_modal ({ alarm, onAccept, onReject, onClose }){
    if (!alarm) return null;

    return (
        <div 
        style={{position: "fixed", 
            inset: 0, 
            background: "rgba(0,0,0,0,3)", 
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            zIndex: 999,
        }}
    >
        <div
        style={{width: "360px",
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center"
        }}
    >
        <h2>🔔 알림</h2>
        <hr />

        <h3>공동 양육자 초대</h3>

        <p>공동 양육자로 초대 되었습니다.</p>

        <div
        style={{display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "20px"
        }}
    >

        <button onClick={() => onAccept(alarm)}>✔ 수락</button>
        <button onClick={() => onReject(alarm)}>✖ 거절</button>
    </div>

    <button style={{ marginTop: "20px" }} onClick={onClose}>닫기</button>
        </div>    
        </div>
    );
}

export default Alarm_modal;
