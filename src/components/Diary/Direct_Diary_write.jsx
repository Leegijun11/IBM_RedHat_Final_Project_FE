import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getCurrentBaby } from "../../services/partner_api";
import { uploadBabyImage } from "../../services/babyimage_api";
import { createDiary } from "../../services/diary_api";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/Direct_Diary_write.css"; 

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Direct_Diary_write = () => {
    const navigate = useNavigate();

    const [babyID, setBabyID] = useState(null);
    const [diaryDate, setDiaryDate] = useState(new Date().toISOString().split("T")[0]);

    const [diaryTitle, setDiaryTitle] = useState("");
    const [diaryContent, setDiaryContent] = useState("");
    const [diaryLabel, setDiaryLabel] = useState("");
    
    const [image, setImage] = useState(null); 
    const [imageView, setImageView] = useState(""); 

    const [tags, setTags] = useState({
        d_eat: false,
        d_sleep: false,
        d_toilet: false,
        d_temp: false
    });

    const handleTagToggle = (tagKey) => {
        setTags((prevTags) => ({
            ...prevTags,
            [tagKey]: !prevTags[tagKey]
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageView(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                setBabyID(baby.b_id);
            } catch (error) {
                console.log(error);
                alert("등록된 아기 정보가 없습니다.");
                navigate("/babyinfo");
            }
        };
        fetchBaby();
    }, [navigate]);

    const handleSaveRecord = async (e) => {
        e.preventDefault();

        if (!diaryLabel) {
            alert("오늘 아이의 감정을 선택해주세요");
            return;
        }
        if (!diaryTitle.trim()) {
            alert("제목을 입력해주세요");
            return;
        }
        if (!diaryContent.trim()) {
            alert("내용을 입력해주세요");
            return;
        }
        if (!babyID) {
            alert("아기 정보를 불러오지 못했습니다");
            return;
        }

        try {
            let uploadedImageUrl = null;
            
            if (image) {
                const response = await uploadBabyImage(babyID, image);
                if (response && response.i_image) {
                    let path = response.i_image.replace(/\.\.\//g, '').replace(/^\/+/, '');
                    uploadedImageUrl = path;
                }
            }

            await createDiary({
                b_id: babyID,
                d_date: diaryDate,
                d_title: diaryTitle,
                d_content: diaryContent,
                d_label: diaryLabel,
                d_image:uploadedImageUrl,
                d_eat: tags.d_eat ? "1" : "0",
                d_sleep: tags.d_sleep ? "1" : "0",
                d_toilet: tags.d_toilet ? "1" : "0",
                d_temp: tags.d_temp ? "1" : "0"
            }, false);

            alert("성장 일기를 등록했습니다");
            navigate("/diary");
        } catch (error) {
            console.log(error);
            alert("성장 일기 등록을 실패했습니다");
        }
    };

    return (
        <div className="direct-diary-container">
            <div className="direct-diary-card">
                <div className="direct-diary-header">
                    <h2>오늘의 기록 ✍️</h2>
                </div>

                <form onSubmit={handleSaveRecord} className="direct-diary-form">
                    
                    {/* 1. 아이의 기분 */}
                    <div className="form-group">
                        <label className="form-label">아이의 기분</label>
                        <div className="select-wrapper">
                            <select className="custom-select" value={diaryLabel} onChange={(e) => setDiaryLabel(e.target.value)}>
                                <option value="" disabled>감정을 선택해주세요</option>
                                <option value="기쁘다">기쁘다</option>
                                <option value="화나다">화나다</option>
                                <option value="슬프다">슬프다</option>
                                <option value="무섭다">무섭다</option>
                                <option value="심심하다">심심하다</option>
                                <option value="짜증나다">짜증나다</option>
                            </select>
                        </div>
                    </div>

                    {/* 2. 제목 */}
                    <div className="form-group">
                        <label className="form-label">제목</label>
                        <input 
                            className="custom-input"
                            type="text" 
                            placeholder="일기 제목을 작성하세요" 
                            value={diaryTitle} 
                            onChange={(e) => setDiaryTitle(e.target.value)} 
                        />
                    </div>

                    {/* 3. 내용 */}
                    <div className="form-group">
                        <label className="form-label">내용</label>
                        <textarea 
                            className="custom-textarea"
                            placeholder="오늘 있었던 일을 자세히 기록해 주세요..." 
                            value={diaryContent} 
                            onChange={(e) => setDiaryContent(e.target.value)} 
                            rows="8"
                        />
                    </div>

                    {/* 4. 오늘의 특이사항 */}
                    <div className="form-group">
                        <label className="form-label">오늘의 특이사항</label>
                        <div className="direct-tags-group">
                            <button type="button" className={`tag-btn ${tags.d_eat ? "active" : ""}`} onClick={() => handleTagToggle("d_eat")}>
                                🍼 식사 {tags.d_eat ? "✅" : ""}
                            </button>
                            <button type="button" className={`tag-btn ${tags.d_sleep ? "active" : ""}`} onClick={() => handleTagToggle("d_sleep")}>
                                💤 수면 {tags.d_sleep ? "✅" : ""}
                            </button>
                            <button type="button" className={`tag-btn ${tags.d_toilet ? "active" : ""}`} onClick={() => handleTagToggle("d_toilet")}>
                                💩 배변 {tags.d_toilet ? "✅" : ""}
                            </button>
                            <button type="button" className={`tag-btn ${tags.d_temp ? "active" : ""}`} onClick={() => handleTagToggle("d_temp")}>
                                🌡️ 체온 {tags.d_temp ? "✅" : ""}
                            </button>
                        </div>
                    </div>

                    {/* 5. 사진 첨부 */}
                    <div className="form-group">
                        <label className="form-label">사진 첨부</label>
                        <label className="file-upload-label">
                            <span className="file-upload-text">📸 탭하여 사진 선택하기</span>
                            <input 
                                className="hidden-file-input"
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                            />
                        </label>
                        {imageView && (
                            <div className="image-preview-wrapper">
                                <img src={imageView} alt="미리보기" className="image-preview" />
                            </div>
                        )}
                    </div>

                    {/* 6. 하단 액션 버튼 (강제 50:50 대칭) */}
                    <div className="action-group">
                        <button type="button" className="action-btn cancel-btn" onClick={() => navigate("/diary")}>
                            취소
                        </button>
                        <button type="submit" className="action-btn submit-btn">
                            저장
                        </button>
                    </div>
                    
                </form>
            </div>
            <NaviBar />
        </div>
    );
};

export default Direct_Diary_write;