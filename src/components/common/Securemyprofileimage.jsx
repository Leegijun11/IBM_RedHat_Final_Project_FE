import { useState, useEffect } from "react";
import { fetchMyProfilePhotoBlob } from "../../services/secureimages_api";

/**
 * 로그인한 본인의 프로필 사진(User.u_image)을 인증된 요청으로 가져와 표시한다.
 * hasImage: user.u_image가 있는지 여부 (없으면 아예 요청 안 보냄)
 */
function SecureMyProfileImage({ hasImage, alt, className }) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        let objectUrl;
        let cancelled = false;

        const load = async () => {
            try {
                const url = await fetchMyProfilePhotoBlob();
                if (!cancelled) {
                    objectUrl = url;
                    setImageUrl(url);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (hasImage) {
            load();
        }

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [hasImage]);

    if (!imageUrl) return null;

    return <img src={imageUrl} alt={alt} className={className} />;
}

export default SecureMyProfileImage;