import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadBabyImage } from "../../services/babyimage_api";
import { getCurrentBaby } from "../../services/partner_api";

function Photo_card() {
    const [bId, setBId] = useState(null);
    const [showMenu, setShowMenu] = useState(false); 
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
        if (!bId) { alert("아기 정보를 불러오지 못했습니다."); return; }
        try {
            await uploadBabyImage(bId, selectedFile);
            alert("사진이 성공적으로 업로드 되었습니다.");
            setShowMenu(false); 
        } catch (error) {
            console.log(error);
            alert("사진 업로드에 실패했습니다.");
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
            <div className="action-icon-circle">📷</div>

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
                    <button className="photo-menu-btn" onClick={triggerInput}>
                        📸 사진 등록
                    </button>
                    <button className="photo-menu-btn" onClick={goToGallery}>
                        🖼️ 사진 갤러리
                    </button>
                </div>
            )}
        </div>
    );
}

export default Photo_card;