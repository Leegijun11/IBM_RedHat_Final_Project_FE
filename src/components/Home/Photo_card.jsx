import { useState } from "react";

function Photo_card() {
    const [image, setImage] = useState (null);

    // 사진 선택
    const handleImageChaange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    // 업로드
    const handleUpload = () => {

        if (!image) {

            alert("사진을 선택해주세요");

            return;
        }

        // 추후 사진 업로드 API 연결

        alert("사진이 업로드 되었습니다.");
    };

    return (
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginBottom: "20px"}}>

            <h2>사진 찍기</h2>
            
            <p>오늘의 순간 담기</p>

            <input type="file" accept="image/*" onChange={handleImageChaange}/>
            <br />
            <br />

            {image && (
                <image src={image} alt="preview" width="200" style={{borderRadius: "10px"}}/>
            )}

            <br />
            <br />

            <button onClick={handleUpload}>업로드</button>
        </div>
    );
}

export default Photo_card;