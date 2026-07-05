import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityDetail, updateCommunity } from "../../services/community_api";
import { uploadForumImage } from "../../services/community_api";
import { getImageUrl } from "../../hooks/imageUrl";
import "../../styles/community_edit.css"; // 소문자 파일명 경로 규칙 적용 완료

const CommunityEdit = () => {
    const navigate = useNavigate();
    const { f_id } = useParams(); 

    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);
    const [imageView, setImageView] = useState("");
    const [tags, setTags] = useState({
        ft_sleep: false,
        ft_food: false,
        ft_health: false,
        ft_play: false
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getCommunityDetail(f_id);
                setTitle(data.f_title);
                setContext(data.f_content);
                setExistingImageUrl(data.f_image)
                setImageView(data.f_image ? getImageUrl(data.f_image) : "")
                setTags({
                    ft_sleep: data.forum_tag?.ft_sleep || false,
                    ft_food: data.forum_tag?.ft_food || false,
                    ft_health: data.forum_tag?.ft_health || false,
                    ft_play: data.forum_tag?.ft_play || false,
                });
            } catch (error) {
                console.error("게시글 불러오기 실패:", error);
                alert("게시글을 불러올 수 없습니다.");
            }
        };
        fetchPost();
    }, [f_id]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImageView(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleTagToggle = (tagName) => {
        setTags((prev) => ({
            ...prev,
            [tagName]: !prev[tagName]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let editedImageUrl = existingImageUrl

        if(imageFile){
            try{
                const response=await uploadForumImage(imageFile)
                editedImageUrl = response.image_url
            }catch(error){
                alert("이미지 업로드에 실패")
                return
            }
        }

        if (!title.trim() || !context.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const updateData = {
            f_title: title,
            f_content: context,
            f_image: editedImageUrl,
            forum_tag: tags
        };

        try {
            await updateCommunity(f_id, updateData);
            alert("게시물이 성공적으로 수정되었습니다!");
            navigate(`/community/${f_id}`);
        } catch (error) {
            console.error("게시물 수정 오류:", error);
            alert("게시물 수정에 실패했습니다.");
        }
    };

    return (
        <div className="community-edit-container">
            <div className="edit-header">
                <h2>게시물 수정 ✍️</h2>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
                
                {/* 1. 제목 입력 */}
                <div className="form-group">
                    <label className="form-label">제목</label>
                    <input 
                        className="edit-input"
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>

                {/* 2. 사진 첨부 */}
                <div className="form-group">
                    <label className="form-label">사진 첨부 (변경 시 선택)</label>
                    
                    <label className="file-upload-label">
                        <span className="file-upload-text">📸 탭하여 사진 변경하기</span>
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

                {/* 3. 태그 선택 */}
                <div className="form-group">
                    <label className="form-label">주제 태그 (여러 개 선택 가능)</label>
                    <div className="edit-tags-group">
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

                {/* 4. 내용 입력 */}
                <div className="form-group">
                    <label className="form-label">내용</label>
                    <textarea 
                        className="edit-textarea"
                        rows="8" 
                        cols="40" 
                        value={context} 
                        onChange={(e) => setContext(e.target.value)} 
                    />
                </div>

                {/* 5. 하단 액션 버튼 */}
                <div className="edit-action-group">
                    <button type="button" className="action-btn cancel-btn" onClick={() => navigate(`/community/${f_id}`)}>
                        취소
                    </button>
                    <button type="submit" className="action-btn submit-btn">
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommunityEdit;