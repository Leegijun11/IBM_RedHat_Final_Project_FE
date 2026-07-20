import { useState, useEffect } from "react";
import { fetchGrowthPhotoBlob } from "../../services/secureimages_api";

/**
 * BabyImage 테이블의 i_id로 성장 사진을 인증된 요청으로 가져와 표시한다.
 * (Photo_Gallery처럼 i_id를 이미 알고 있는 목록에서 사용)
 */
function SecureGrowthImage({ i_id, alt, className, style }) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        let objectUrl;
        let cancelled = false;

        const load = async () => {
            try {
                const url = await fetchGrowthPhotoBlob(i_id);
                if (!cancelled) {
                    objectUrl = url;
                    setImageUrl(url);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (i_id) {
            load();
        }

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [i_id]);

    if (!imageUrl) return null;

    return <img src={imageUrl} alt={alt} className={className} style={style} />;
}

export default SecureGrowthImage;