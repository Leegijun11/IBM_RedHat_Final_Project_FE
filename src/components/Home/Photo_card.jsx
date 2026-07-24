import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadBabyImage } from "../../services/babyimage_api";
import { getCurrentBaby } from "../../services/partner_api";
import { useModal } from "../../hooks/useModal";

function Photo_card() {
    const [bId, setBId] = useState(null);
    const [showMenu, setShowMenu] = useState(false); 
    const { showAlert } = useModal(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                if (baby) { setBId(baby.b_id); }
            } catch (error) { console.log(error); }
        };
        fetchBaby();
    }, []);

    const handleImmediateUpload = async (selectedFile) => {
        if (!selectedFile) return;
        if (!bId) { showAlert("정보를 불러오지 못했습니다.", "error"); return; }
        try {
            await uploadBabyImage(bId, selectedFile);
            showAlert("4x2 규격에 맞춰 성공적으로 기록되었습니다.");
            setShowMenu(false); 
        } catch (error) {
            console.log(error);
            showAlert("사진 업로드에 실패했습니다.", "error");
        }
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleImmediateUpload(selectedFile);
        }
        e.target.value = null;
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const triggerInput = (e) => {
        e.stopPropagation();
        document.getElementById("hidden-file-input").click();
    };

    const goToGallery = (e) => {
        e.stopPropagation();
        navigate("/home/gallery");
    };

    return (
        <div className="action-click-card photo-bg" onClick={toggleMenu}>
            <div className="action-icon-circle">
                {/* 🌟 기존 📷 이모지 대체: 세련된 카메라 선화 SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }}>
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                </svg>
            </div>

            <input
                id="hidden-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }} 
            />

            {!showMenu ? (
                <div className="photo-card-default">
                    <h2>사진 찍기</h2>
                    <p>오늘의 순간 담기</p>
                    <span className="action-card-btn">탭하여 선택</span>
                </div>
            ) : (
                <div className="photo-card-menu">
                    <button className="photo-menu-btn" onClick={triggerInput} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {/* 🌟 기존 📸 이모지 대체: 사진 등록용 SVG */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        사진 등록
                    </button>
                    <button className="photo-menu-btn" onClick={goToGallery} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {/* 🌟 기존 🖼️ 이모지 대체: 갤러리/그리드 뷰 SVG */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        갤러리 보기
                    </button>
                </div>
            )}
        </div>
    );
}

export default Photo_card;