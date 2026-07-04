import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity, uploadForumImage } from "../../services/community_api";

const CommunityCreate = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageView, setImageView] = useState("");

    const [tags, setTags] = useState({
        ft_sleep: false,
        ft_food: false,
        ft_health: false,
        ft_play: false
    });

    const handleTagToggle = (tagName) => {
        setTags((prev) => ({
            ...prev,
            [tagName]: !prev[tagName] 
        }));
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

        if (!title.trim() || !context.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        let uploadedImageUrl = null;
        if (imageFile){
            try{
                const response = await uploadForumImage(imageFile);
                uploadedImageUrl = response.image_url;
            } catch(error){
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드에 실패했습니다.");
                return;
            }
        }


        const postData = {
            f_title: title,
            f_content: context,
            f_image: uploadedImageUrl || "",
            forum_tag: {
                ft_sleep: tags.ft_sleep,
                ft_food: tags.ft_food,
                ft_health: tags.ft_health,
                ft_play: tags.ft_play
            }
        };


        try {
            await createCommunity(postData);
            alert("새 게시물이 성공적으로 등록되었습니다!");
            navigate('/community');
        } catch (error) {
            alert("게시물 작성에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>새 게시물 작성</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목: </label>
                    <input type="text" placeholder="제목을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>

                <div>
                    <p>주제 태그 (여러 개 선택 가능):</p>
                    <button type="button" onClick={() => handleTagToggle("ft_sleep")}>
                        수면 {tags.ft_sleep ? "✅" : ""}
                    </button>
                    <button type="button" onClick={() => handleTagToggle("ft_food")}>
                        이유식 {tags.ft_food ? "✅" : ""}
                    </button>
                    <button type="button" onClick={() => handleTagToggle("ft_health")}>
                        건강 {tags.ft_health ? "✅" : ""}
                    </button>
                    <button type="button" onClick={() => handleTagToggle("ft_play")}>
                        놀이 {tags.ft_play ? "✅" : ""}
                    </button>
                </div>

                <div>
                    <p>사진 첨부:</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {imageView && (
                        <div>
                            <img src={imageView} alt="미리보기" width="150" />
                        </div>
                    )}
                </div>

                <div>
                    <p>내용:</p>
                    <textarea rows="8" cols="40" placeholder="내용을 입력해주세요" value={context} onChange={(e) => setContext(e.target.value)}/>
                </div>

                <div>
                    <button type="button" onClick={() => navigate('/community')}>취소</button>
                    <button type="submit">등록하기</button>
                </div>
            </form>
        </div>
    );
};

export default CommunityCreate;