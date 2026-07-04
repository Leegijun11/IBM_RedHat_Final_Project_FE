import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommunityDetail, updateCommunity } from "../../services/community_api";
import { uploadForumImage } from "../../services/community_api";
import { getImageUrl } from "../../hooks/imageUrl";

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
        <div>
            <h2>게시물 수정</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목: </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>


                <div>
                    <p>사진 첨부 (변경 시 선택):</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {imageView && (
                        <div>
                            <img src={imageView} alt="미리보기" width="150" />
                        </div>
                    )}
                </div>

                <div>
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
                    <p>내용:</p>
                    <textarea rows="8" cols="40" value={context} onChange={(e) => setContext(e.target.value)} />
                </div>

                <div>
                    <button type="button" onClick={() => navigate(`/community/${f_id}`)}>취소</button>
                    <button type="submit">수정 완료</button>
                </div>
            </form>
        </div>
    );
};

export default CommunityEdit;