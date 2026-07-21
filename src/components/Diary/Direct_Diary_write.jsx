import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getCurrentBaby } from "../../services/partner_api";
import { uploadBabyImage } from "../../services/babyimage_api";
import { createDiary } from "../../services/diary_api";
import { useModal } from "../../hooks/useModal";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/Direct_Diary_write.css"; 

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Direct_Diary_write = () => {
    const navigate = useNavigate();
    const { showAlert } = useModal(); 

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

    const [tagValues, setTagValues] = useState({
        d_eat: "",
        d_sleep: "",
        d_toilet: "",
        d_temp: ""
    });

    const handleTagToggle = (tagKey) => {
        setTags((prevTags) => {
            const isActive = !prevTags[tagKey];
            if (!isActive) {
                setTagValues((prevVals) => ({ ...prevVals, [tagKey]: "" }));
            }
            return { ...prevTags, [tagKey]: isActive };
        });
    };

    const handleTagValueChange = (tagKey, value) => {
        setTagValues((prevVals) => ({ ...prevVals, [tagKey]: value }));
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
                showAlert("등록된 아기 정보가 없습니다.", "error");
                navigate("/babyinfo");
            }
        };
        fetchBaby();
    }, [navigate]);

    const handleSaveRecord = async (e) => {
        e.preventDefault();

        if (!diaryLabel) return showAlert("오늘 아이의 감정을 선택해주세요", "error");
        if (!diaryTitle.trim()) return showAlert("제목을 입력해주세요", "error");
        if (!diaryContent.trim()) return showAlert("내용을 입력해주세요", "error");
        if (!babyID) return showAlert("아기 정보를 불러오지 못했습니다", "error");

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
                d_image: uploadedImageUrl,
                d_eat: (tags.d_eat && tagValues.d_eat) ? `${tagValues.d_eat}회` : "",
                d_sleep: (tags.d_sleep && tagValues.d_sleep) ? `${tagValues.d_sleep}시간` : "",
                d_toilet: (tags.d_toilet && tagValues.d_toilet) ? `${tagValues.d_toilet}회` : "",
                d_temp: (tags.d_temp && tagValues.d_temp) ? `${tagValues.d_temp}도` : ""
            }, false);

            showAlert("성장 일기를 등록했습니다");
            navigate("/diary");
        } catch (error) {
            console.log(error);
            showAlert("성장 일기 등록을 실패했습니다", "error");
        }
    };

    return (
        <div className="direct-diary-container page-container">
            <div className="direct-diary-card">
                <div className="direct-diary-header">
                    <h2>오늘의 기록 ✍️</h2>
                </div>

                <form onSubmit={handleSaveRecord} className="direct-diary-form">
                    
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

                    <div className="form-group">
                        <label className="form-label">제목</label>
                        <input className="custom-input" type="text" placeholder="일기 제목을 작성하세요" value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">내용</label>
                        <textarea className="custom-textarea" placeholder="오늘 있었던 일을 자세히 기록해 주세요..." value={diaryContent} onChange={(e) => setDiaryContent(e.target.value)} rows="8" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">오늘의 특이사항</label>
                        
                        {/* 1. 가로로 정렬된 태그 버튼 그룹 */}
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

                        {/* 2. 활성화된 태그의 입력창 (깔끔한 리스트 형태) */}
                        {(tags.d_eat || tags.d_sleep || tags.d_toilet || tags.d_temp) && (
                            <div className="tag-inputs-container">
                                {tags.d_eat && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label">🍼 식사</span>
                                        <input type="number" min="0" className="custom-input small-input" placeholder="예) 3" value={tagValues.d_eat} onChange={(e) => handleTagValueChange("d_eat", e.target.value)} />
                                        <span className="tag-input-unit">회</span>
                                    </div>
                                )}
                                {tags.d_sleep && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label">💤 수면</span>
                                        <input type="number" min="0" className="custom-input small-input" placeholder="예) 8" value={tagValues.d_sleep} onChange={(e) => handleTagValueChange("d_sleep", e.target.value)} />
                                        <span className="tag-input-unit">시간</span>
                                    </div>
                                )}
                                {tags.d_toilet && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label">💩 배변</span>
                                        <input type="number" min="0" className="custom-input small-input" placeholder="예: 2" value={tagValues.d_toilet} onChange={(e) => handleTagValueChange("d_toilet", e.target.value)} />
                                        <span className="tag-input-unit">회</span>
                                    </div>
                                )}
                                {tags.d_temp && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label">🌡️ 체온</span>
                                        <input type="number" step="0.1" className="custom-input small-input" placeholder="예: 36.5" value={tagValues.d_temp} onChange={(e) => handleTagValueChange("d_temp", e.target.value)} />
                                        <span className="tag-input-unit">도</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">사진 첨부</label>
                        <label className="file-upload-label">
                            <span className="file-upload-text">📸 탭하여 사진 선택하기</span>
                            <input className="hidden-file-input" type="file" accept="image/*" onChange={handleImageChange} />
                        </label>
                        {imageView && (
                            <div className="image-preview-wrapper">
                                <img src={imageView} alt="미리보기" className="image-preview" />
                            </div>
                        )}
                    </div>

                    <div className="action-group">
                        <button type="button" className="action-btn cancel-btn" onClick={() => navigate("/diary")}>취소</button>
                        <button type="submit" className="action-btn submit-btn">저장</button>
                    </div>
                    
                </form>
            </div>
            <NaviBar />
        </div>
    );
};

export default Direct_Diary_write;