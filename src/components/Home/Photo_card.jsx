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
                if (baby) {
                    setBId(baby.b_id);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchBaby();
    }, []);

    // 사진 선택
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
        }
    };

    // 업로드
    const handleUpload = async () => {
        if (!file) {
            alert("사진을 선택해주세요");
            return;
        }

        if (!bId) {
            alert("아기 정보를 불러오지 못했습니다.");
            return;
        }

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

    return (
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginBottom: "20px"}}>

            <h2>사진 찍기</h2>

            <p>오늘의 순간 담기</p>

            <input type="file" accept="image/*" onChange={handleImageChange}/>
            <br />
            <br />

            {image && (
                <img src={image} alt="preview" width="200" style={{borderRadius: "10px"}}/>
            )}

            <br />
            <br />

            <button onClick={handleUpload}>업로드</button>
        </div>
    );
}

export default Photo_card;