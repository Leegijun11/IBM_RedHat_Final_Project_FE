import { useState, useEffect } from "react";
import { uploadBabyImage } from "../../services/babyimage_api";
import { getCurrentBaby } from "../../services/partner_api";

function Photo_card() {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [bId, setBId] = useState(null);

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                if (baby) { setBId(baby.b_id); }
            } catch (error) { console.log(error); }
        };
        fetchBaby();
    }, []);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e) => {
        e.stopPropagation();
        if (!file) { alert("사진을 선택해주세요"); return; }
        if (!bId) { alert("아기 정보를 불러오지 못했습니다."); return; }
        try {
            await uploadBabyImage(bId, file);
            alert("사진이 업로드 되었습니다.");
            setImage(null);
            setFile(null);
        } catch (error) {
            console.log(error);
            alert("사진 업로드에 실패했습니다.");
        }
    };

    const triggerInput = () => {
        document.getElementById("hidden-file-input").click();
    };

    return (
        <div className="action-click-card photo-bg" onClick={triggerInput}>
            <div className="action-icon-circle">📷</div>
            <h2>사진 찍기</h2>
            <p>오늘의 순간 담기</p>

            <input
                id="hidden-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
            />

            {file ? (
                <button
                    className="action-card-btn"
                    onClick={(e) => { e.stopPropagation(); handleUpload(e); }}
                >
                    업로드 확정 ↑
                </button>
            ) : (
                <span className="action-card-btn">탭하여 선택</span>
            )}
        </div>
    );
}

export default Photo_card;