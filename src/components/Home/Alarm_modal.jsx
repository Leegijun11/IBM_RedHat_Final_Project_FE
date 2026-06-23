import { useState } from "react";

function Alarm_modal() {
    const [isOpen, setIsOpen] = useState(false);

    // 임시 데이터 추후 변경
    const [partnerInvite, setPartnerInvite] = useState({name: "박준현", relation: "아빠"});

    // 수락
    const handleAccept = () => {

        //공동 양육자 수락 API 추후 연결

        alert("공동 양육자 초대를 수락하였습니다.");

        setIsOpen(false);
    };

    // 거절
    const handleReject = () => {

        // 공동 약육자 거절 API 추후 연결

        alert("공동 양육자 초대를 거절하였습니다.");

        setIsOpen(false);
    };

    return (

        <div style={{marginBottom: "20px"}}>

            <button onClick={() => setIsOpen(true)}>🔔 알림</button>

            {isOpen && (
                <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20ox", marginBottom: "20px"}}>

                    <h2>공동 양육자 초대</h2>

                    <h3>{partnerInvite.name} ({partnerInvite.relation})</h3>

                    <p>공동 양육자로 초대 하였습니다.</p>

                    <button onClick={handleAccept}>수락</button>
                    <button onClick={handleReject} style={{marginLeft: "10px"}}>거절</button>
                    <button onClick={() => setIsOpen(false)} style={{marginLeft: "10px"}}>닫기</button>
                </div>
            )}

        </div>
    );
}

export default Alarm_modal;