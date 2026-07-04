import api from "../hooks/api";


// 게시글 목록
export const getCommunity = async (
    page = 1,
    size = 10,
    keyword = "",
    sort = "created_at, desc",
    tag = "",
    babyCharacter = "",
    b_id = null
) => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    const response = await api.get("/forums/list", {
        params: {
            page,
            size,
            keyword: keyword || undefined,
            sort,
            tag: tag || undefined,
            baby_character: babyCharacter || undefined,
            b_id: b_id || undefined,
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    return response.data;
}


// 게시글 상세
export const getCommunityDetail=async (f_id)=>{
    const token=localStorage.getItem('token')

    const config=token ? {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }: {}

    const response=await api.get(`/forums/context/${f_id}`, config)
    return response.data
}

// 게시글 작성
export const createCommunity=async (formData)=>{
    const response=await api.post(`/forums/create`, formData)
    return response.data
}

//게시글 수정
export const updateCommunity=async (f_id, formData)=>{

    const token=localStorage.getItem("token") || localStorage.getItem("access_token")
    const config=token ? {headers: {Authorization: `Bearer ${token}`}} : {}

    const response=await api.put(`/forums/edit/${f_id}`, formData, config)
    return response.data
}

//게시글 삭제
export const deleteCommunity=async (f_id)=>{
    const token = localStorage.getItem("token") || localStorage.getItem("access_token")
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    const response=await api.delete(`/forums/del/${f_id}`, config)
    return response.data
}


//게시글 좋아요
export const toggleCommunityLike = async (f_id, isLiked) => {
    const token = localStorage.getItem("token"); 
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    if (isLiked){
        const response=await api.delete(`/forumlike/${f_id}`, config)
        return response.data
    } else {
        const response=await api.post(`/forumlike/${f_id}`, null, config);
        return response.data
    }
};





//댓글 목록
export const getComments=async (f_id)=>{
    const response=await api.get(`/forumcomment/list/${f_id}`)
    return response.data
}



//댓글 작성
export const createComments=async (f_id, commentData)=>{
    const response=await api.post(`/forumcomment/create/${f_id}`, commentData)
    return response.data
}



//댓글 수정
export const updateComments=async(fc_id, commentData)=>{
    const response=await api.put(`/forumcomment/update/${fc_id}`, commentData)
    return response.data
}


//댓글 삭제
export const deleteComments=async (fc_id)=>{
    const response=await api.delete(`/forumcomment/del/${fc_id}`)
    return response.data
}

// 댓글 좋아요 생성
export const createCommentLike = async (fc_id) => {
    return await api.post(`/forumcommentlike/create/${fc_id}`);
};

// 댓글 좋아요 취소
export const deleteCommentLike = async (fc_id) => {
    return await api.delete(`/forumcommentlike/del/${fc_id}`);
};

export const uploadForumImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post("/forums/upload_image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; 
};