import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity, uploadForumImage } from "../../services/community_api";
import { useModal } from "../../hooks/useModal";
import "../../styles/community_create.css"; 

const CommunityCreate = () => {
    const navigate = useNavigate();
    const { showAlert } = useModal(); 

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
            showAlert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        let uploadedImageUrl = null;
        if (imageFile){
            try{
                const response = await uploadForumImage(imageFile);
                uploadedImageUrl = response.image_url;
            } catch(error){
                console.error("이미지 업로드 실패:", error);
                showAlert("이미지 업로드에 실패했습니다.");
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
            showAlert("새 게시물이 성공적으로 등록되었습니다!");
            navigate('/community');
        } catch (error) {
            showAlert("게시물 작성에 실패했습니다.");
        }
    };

    return (
        <div className="community-create-container">
            <div className="create-header">
                <h2>새 게시물 작성 ✍️</h2>
            </div>

            <form onSubmit={handleSubmit} className="create-form">
                
                {/* 1. 제목 입력 */}
                <div className="form-group">
                    <label className="form-label">제목</label>
                    <input 
                        className="create-input" 
                        type="text" 
                        placeholder="제목을 입력해주세요" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* 2. 태그 선택 */}
                <div className="form-group">
                    <label className="form-label">주제 태그 (여러 개 선택 가능)</label>
                    <div className="create-tags-group">
                        <button type="button" className={`tag-btn ${tags.ft_sleep ? "active" : ""}`} onClick={() => handleTagToggle("ft_sleep")}>
                            수면 {tags.ft_sleep ? "✅" : ""}
                        </button>
                        <button type="button" className={`tag-btn ${tags.ft_food ? "active" : ""}`} onClick={() => handleTagToggle("ft_food")}>
                            이유식 {tags.ft_food ? "✅" : ""}
                        </button>
                        <button type="button" className={`tag-btn ${tags.ft_health ? "active" : ""}`} onClick={() => handleTagToggle("ft_health")}>
                            건강 {tags.ft_health ? "✅" : ""}
                        </button>
                        <button type="button" className={`tag-btn ${tags.ft_play ? "active" : ""}`} onClick={() => handleTagToggle("ft_play")}>
                            놀이 {tags.ft_play ? "✅" : ""}
                        </button>
                    </div>
                </div>

                {/* 3. 사진 첨부 */}
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

                {/* 4. 내용 입력 */}
                <div className="form-group">
                    <label className="form-label">내용</label>
                    <textarea 
                        className="create-textarea"
                        rows="8" 
                        placeholder="오늘의 육아 이야기를 자세히 들려주세요..." 
                        value={context} 
                        onChange={(e) => setContext(e.target.value)}
                    />
                </div>

                {/* 5. 하단 액션 버튼 */}
                <div className="create-action-group">
                    <button type="button" className="action-btn cancel-btn" onClick={() => navigate('/community')}>
                        취소
                    </button>
                    <button type="submit" className="action-btn submit-btn">
                        등록하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommunityCreate;