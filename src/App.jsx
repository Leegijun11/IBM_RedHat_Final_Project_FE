import { useState, useEffect } from 'react'


const BACKEND_URL = "https://api.dearbaby.site";

function App() {

  const [dbStatus, setDbStatus] = useState("⌛ 연결 확인 중...")
  const [itemName, setItemName] = useState("")
  const [message, setMessage] = useState("")


  useEffect(() => {
    fetch(`${BACKEND_URL}/health/db`)
      .then((res) => {
        if (!res.ok) throw new Error(`에러 발생 (코드: ${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (data.database === "connected") setDbStatus("✅ AWS RDS DB 연결 성공!");
        else setDbStatus("⚠️ DB 연결 상태 이상");
      })
      .catch((err) => setDbStatus(`❌ 연결 실패: ${err.message}`));
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return alert("아이템 이름을 입력하세요!");

    setMessage("⏳ 등록 중...");

    fetch(`${BACKEND_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: itemName, description: "테스트 설명"
       }) 
    })
      .then((res) => {
        if (!res.ok) throw new Error(`등록 실패 (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setMessage(`🎉 등록 성공! (ID: ${data.id || '확인됨'})`);
        setItemName(""); 
      })
      .catch((err) => setMessage(`❌ 등록 에러: ${err.message}`));
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h2>🚀 Full-Stack 연동 테스트</h2>
      <hr />

      {/* DB 상태 표시 구역 */}
      <div style={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px', margin: '20px 0', fontWeight: 'bold' }}>
        DB 상태: {dbStatus}
      </div>

      {/* 데이터 입력 및 API 전송 구역 */}
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>🎁 items 테이블 데이터 추가</h3>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="아이템 이름 입력" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)}
            style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #aaa' }}
          />
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            보내기
          </button>
        </form>
        
        {/* 결과 메시지 */}
        {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#0056b3' }}>{message}</p>}
      </div>
    </div>
  )
}

export default App