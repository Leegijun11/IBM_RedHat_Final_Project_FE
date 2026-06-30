import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEBook } from "../../services/ebook_api";
import { getBabies } from "../../services/baby_api";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/EBookCreate.css";

function EBookCreate() {
  const navigate = useNavigate();

  const [bId, setBId] = useState(null);

  const [period, setPeriod] = useState({
    start: "",
    end: "",
  });

  // 아기 정보 조회
  useEffect(() => {
    const fetchBaby = async () => {
      try {
        const babies = await getBabies();

        if (!babies || babies.length === 0) {
          alert("등록된 아기 정보가 없습니다.");
          navigate("/babyinfo");
          return;
        }

        setBId(babies[0].b_id);
      } catch (error) {
        console.error(error);
        alert("로그인이 필요합니다.");
        navigate("/");
      }
    };

    fetchBaby();
  }, [navigate]);

  // 디지털북 생성
  const handleCreate = async () => {
    if (!period.start || !period.end) {
      alert("기간을 선택해주세요.");
      return;
    }

    try {
      await createEBook({
        b_id: bId,
        start_date: period.start,
        end_date: period.end,
      });

      alert("디지털 북이 생성되었습니다.");
      navigate("/ebook");
    } catch (error) {
      console.error(error);
      alert("생성에 실패했습니다.");
    }
  };

  return (
    <div className="ebook-create-page">

      <div className="create-header">
        <h2>📖 디지털 북 만들기</h2>
        <p>원하는 기간을 선택하여 성장 디지털 북을 생성하세요.</p>
      </div>

      <div className="create-card">

        <h3>기간 선택하기</h3>

        <label className="create-label">
          시작 날짜
        </label>

        <input
          className="date-input"
          type="date"
          value={period.start}
          onChange={(e) =>
            setPeriod({
              ...period,
              start: e.target.value,
            })
          }
        />

        <label className="create-label">
          종료 날짜
        </label>

        <input
          className="date-input"
          type="date"
          value={period.end}
          onChange={(e) =>
            setPeriod({
              ...period,
              end: e.target.value,
            })
          }
        />

        <button
          className="create-submit"
          onClick={handleCreate}
        >
          디지털 북 생성
        </button>

      </div>

      <NaviBar />
    </div>
  );
}

export default EBookCreate;