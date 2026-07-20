import { useState, useEffect } from "react";
import { fetchPartnerProfilePhotoBlob } from "../../services/secureimages_api";

/**
 * 같은 케어그룹 멤버(공동 양육자)의 프로필 사진을 인증된 요청으로 가져와 표시한다.
 * u_id는 대상 사용자의 u_id (partner.u_id).
 */
function SecurePartnerImage({ u_id, alt, className }) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        let objectUrl;
        let cancelled = false;

        const load = async () => {
            try {
                const url = await fetchPartnerProfilePhotoBlob(u_id);
                if (!cancelled) {
                    objectUrl = url;
                    setImageUrl(url);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (u_id) {
            load();
        }

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [u_id]);

    if (!imageUrl) return null;

    return <img src={imageUrl} alt={alt} className={className} />;
}

export default SecurePartnerImage;