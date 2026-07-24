import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDiaryDetail, editDiary } from "../../services/diary_api";
import { uploadBabyImage } from "../../services/babyimage_api";
import { getCurrentBaby } from "../../services/partner_api";
import { fetchImageByPathBlob } from "../../services/secureimages_api";
import { useModal } from "../../hooks/useModal";
import NaviBar from "../../components/common/NaviBar"; 
import "../../styles/Diary_edit.css"; // CSS 경로

const Diary_edit = () => {
    const navigate = useNavigate();
    const { d_id } = useParams(); 
    const { showAlert } = useModal(); 
    
    const [babyID, setBabyID] = useState(null);
    const [diaryDate, setDiaryDate] = useState("");
    const [diaryTitle, setDiaryTitle] = useState("");
    const [diaryContent, setDiaryContent] = useState("");
    const [diaryLabel, setDiaryLabel] = useState("");
    
    const [imageFile, setImageFile] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);
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

    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const baby = await getCurrentBaby();
                setBabyID(baby.b_id); 

                const data = await getDiaryDetail(d_id);
                
                setDiaryDate(data.d_date ? data.d_date.split("T")[0] : new Date().toISOString().split("T")[0]);
                setDiaryTitle(data.d_title);
                setDiaryContent(data.d_content);
                setDiaryLabel(data.d_label);
                
                setExistingImageUrl(data.d_image);
                
                // ★ 변경 포인트: BACKEND_URL을 그냥 이어붙이던 방식 대신
                //   인증된 요청(fetchImageByPathBlob)으로 기존 사진을 가져온다.
                if (data.d_image) {
                    if (data.d_image.startsWith("http")) {
                        setImageView(data.d_image);
                    } else {
                        try {
                            const cleanPath = data.d_image.replace(/\.\.\//g, '').replace(/^\/+/, '');
                            const blobUrl = await fetchImageByPathBlob(cleanPath);
                            setImageView(blobUrl);
                        } catch (imgError) {
                            console.log(imgError);
                        }
                    }
                }

                // 기존 문자열에서 숫자와 소수점만 추출하는 함수 (예: "3.5도" -> "3.5")
                const extractNumber = (str) => str ? str.replace(/[^0-9.]/g, '') : "";
                // 값이 유효하게 존재하는지 체크
                const hasTag = (val) => val && val !== "0" && val !== "";

                setTags({
                    d_eat: hasTag(data.d_eat),
                    d_sleep: hasTag(data.d_sleep),
                    d_toilet: hasTag(data.d_toilet),
                    d_temp: hasTag(data.d_temp)
                });

                setTagValues({
                    d_eat: extractNumber(data.d_eat),
                    d_sleep: extractNumber(data.d_sleep),
                    d_toilet: extractNumber(data.d_toilet),
                    d_temp: extractNumber(data.d_temp)
                });

            } catch (error) {
                console.error("일기 불러오기 실패:", error);
                await showAlert("일기를 불러올 수 없습니다.", "error");
                navigate(-1);
            }
        };
        fetchDiary();
    }, [d_id, navigate]);

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
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageView(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!diaryLabel) return showAlert("오늘 아이의 감정을 선택해주세요.", "error");
        if (!diaryTitle.trim() || !diaryContent.trim()) return showAlert("제목과 내용을 모두 입력해주세요.", "error");

        let editedImageUrl = existingImageUrl;

        if (imageFile) {
            try {
                const response = await uploadBabyImage(babyID, imageFile);
                if (response && response.i_image) {
                    let path = response.i_image.replace(/\.\.\//g, '').replace(/^\/+/, '');
                    editedImageUrl = path;
                }
            } catch (error) {
                showAlert("이미지 업로드에 실패했습니다.", "error");
                return;
            }
        }

        // 수치 데이터를 이전 작성창과 동일한 포맷으로 저장
        const updateData = {
            b_id: babyID,
            d_date: diaryDate,
            d_title: diaryTitle,
            d_content: diaryContent,
            d_label: diaryLabel,
            d_image: editedImageUrl,
            d_eat: (tags.d_eat && tagValues.d_eat) ? `${tagValues.d_eat}회` : "",
            d_sleep: (tags.d_sleep && tagValues.d_sleep) ? `${tagValues.d_sleep}시간` : "",
            d_toilet: (tags.d_toilet && tagValues.d_toilet) ? `${tagValues.d_toilet}회` : "",
            d_temp: (tags.d_temp && tagValues.d_temp) ? `${tagValues.d_temp}도` : ""
        };

        try {
            await editDiary(d_id, updateData);
            showAlert("일기가 성공적으로 수정되었습니다!");
            navigate(`/diary/${d_id}`);
        } catch (error) {
            console.error("일기 수정 오류:", error);
            showAlert("일기 수정에 실패했습니다.", "error");
        }
    };

    return (
        <div className="diary-edit-container">
            <div className="diary-edit-card">
                <div className="diary-edit-header">
                    {/* 🌟 텍스트 이모지 ✍️ 대체 (펜 SVG) */}
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        성장 일기 수정
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F07C60" }}>
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                        </svg>
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="diary-edit-form">
                    
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
                        <input className="custom-input" type="text" placeholder="일기 제목을 작성하세요" value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} />
                    </div>

                    {/* 3. 내용 */}
                    <div className="form-group">
                        <label className="form-label">내용</label>
                        <textarea className="custom-textarea" placeholder="오늘 있었던 일을 자세히 기록해 주세요..." value={diaryContent} onChange={(e) => setDiaryContent(e.target.value)} rows="8" />
                    </div>

                    {/* 4. 오늘의 특이사항 */}
                    <div className="form-group">
                        <label className="form-label">오늘의 특이사항</label>
                        
                        {/* 1. 가로로 정렬된 태그 버튼 그룹 */}
                        <div className="edit-tags-group">
                            <button type="button" className={`tag-btn ${tags.d_eat ? "active" : ""}`} onClick={() => handleTagToggle("d_eat")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                {/* 🌟 🍼 대체 (수저 SVG) */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 2c-1.7 0-3 1.8-3 4 0 2 1.3 3.5 2.5 3.9V22"/>
                                    <path d="M8 2c1.7 0 3 1.8 3 4 0 2-1.3 3.5-2.5 3.9"/>
                                    <line x1="15" y1="2" x2="15" y2="22"/>
                                    <line x1="19" y1="2" x2="19" y2="22"/>
                                </svg>
                                식사
                                {/* 🌟 ✅ 대체 (체크 SVG) */}
                                {tags.d_eat && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </button>
                            <button type="button" className={`tag-btn ${tags.d_sleep ? "active" : ""}`} onClick={() => handleTagToggle("d_sleep")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                {/* 🌟 💤 대체 (달 SVG) */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                                수면
                                {tags.d_sleep && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </button>
                            <button type="button" className={`tag-btn ${tags.d_toilet ? "active" : ""}`} onClick={() => handleTagToggle("d_toilet")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                {/* 🌟 💩 대체 (똥 SVG) */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2C8 2 8 7 8 7c-2 0-3 1.5-3 3 0 1.3 1 2.5 2 3-1.5.5-3 2-3 4 0 2.5 3 4 8 4s8-1.5 8-4c0-2-1.5-3.5-3-4 1-.5 2-1.7 2-3 0-1.5-1-3-3-3 0 0 0-5-4-5z"/>
                                </svg>
                                배변
                                {tags.d_toilet && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </button>
                            <button type="button" className={`tag-btn ${tags.d_temp ? "active" : ""}`} onClick={() => handleTagToggle("d_temp")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                {/* 🌟 🌡️ 대체 (온도계 SVG) */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                                    <path d="M12 12v3"/>
                                </svg>
                                체온
                                {tags.d_temp && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* 2. 활성화된 태그의 입력창 (깔끔한 리스트 형태) */}
                        {(tags.d_eat || tags.d_sleep || tags.d_toilet || tags.d_temp) && (
                            <div className="tag-inputs-container">
                                {tags.d_eat && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M8 2c-1.7 0-3 1.8-3 4 0 2 1.3 3.5 2.5 3.9V22"/>
                                                <path d="M8 2c1.7 0 3 1.8 3 4 0 2-1.3 3.5-2.5 3.9"/>
                                                <line x1="15" y1="2" x2="15" y2="22"/>
                                                <line x1="19" y1="2" x2="19" y2="22"/>
                                            </svg>
                                            식사
                                        </span>
                                        <input type="number" min="0" className="custom-input small-input" placeholder="예) 3" value={tagValues.d_eat} onChange={(e) => handleTagValueChange("d_eat", e.target.value)} />
                                        <span className="tag-input-unit">회</span>
                                    </div>
                                )}
                                {tags.d_sleep && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                            </svg>
                                            수면
                                        </span>
                                        <input type="number" min="0" className="custom-input small-input" placeholder="예) 8" value={tagValues.d_sleep} onChange={(e) => handleTagValueChange("d_sleep", e.target.value)} />
                                        <span className="tag-input-unit">시간</span>
                                    </div>
                                )}
                                {tags.d_toilet && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2C8 2 8 7 8 7c-2 0-3 1.5-3 3 0 1.3 1 2.5 2 3-1.5.5-3 2-3 4 0 2.5 3 4 8 4s8-1.5 8-4c0-2-1.5-3.5-3-4 1-.5 2-1.7 2-3 0-1.5-1-3-3-3 0 0 0-5-4-5z"/>
                                            </svg>
                                            배변
                                        </span>
                                        <input type="number" min="0" className="custom-input small-input" placeholder="예: 2" value={tagValues.d_toilet} onChange={(e) => handleTagValueChange("d_toilet", e.target.value)} />
                                        <span className="tag-input-unit">회</span>
                                    </div>
                                )}
                                {tags.d_temp && (
                                    <div className="tag-input-row">
                                        <span className="tag-input-label" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                                                <path d="M12 12v3"/>
                                            </svg>
                                            체온
                                        </span>
                                        <input type="number" step="0.1" className="custom-input small-input" placeholder="예: 36.5" value={tagValues.d_temp} onChange={(e) => handleTagValueChange("d_temp", e.target.value)} />
                                        <span className="tag-input-unit">도</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 5. 사진 첨부 */}
                    <div className="form-group">
                        <label className="form-label">사진 첨부 (변경 시 선택)</label>
                        <label className="file-upload-label">
                            <span className="file-upload-text" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                {/* 🌟 📸 대체 (카메라 SVG) */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F07C60" }}>
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                                    <circle cx="12" cy="13" r="3"/>
                                </svg>
                                탭하여 사진 변경하기
                            </span>
                            <input className="hidden-file-input" type="file" accept="image/*" onChange={handleImageChange} />
                        </label>
                        {imageView && (
                            <div className="image-preview-wrapper">
                                <img src={imageView} alt="미리보기" className="image-preview" />
                            </div>
                        )}
                    </div>

                    {/* 6. 하단 액션 버튼 */}
                    <div className="action-group">
                        <button type="button" className="action-btn cancel-btn" onClick={() => navigate(`/diary/${d_id}`)}>취소</button>
                        <button type="submit" className="action-btn submit-btn">수정 완료</button>
                    </div>
                    
                </form>
            </div>
            <NaviBar />
        </div>
    );
};

export default Diary_edit;