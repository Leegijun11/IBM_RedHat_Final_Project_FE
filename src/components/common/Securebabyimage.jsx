import { useState, useEffect } from "react";
import { fetchBabyProfilePhotoBlob } from "../../services/secureimages_api";

/**
 * 인가(권한) 체크를 거치는 /secure-images/baby/{b_id}/profile 를 호출해서
 * blob으로 받아온 뒤 <img>로 표시하는 컴포넌트.
 * 기존에 <img src={getImageUrl(baby.b_image)} /> 로 쓰던 자리를
 * <SecureBabyImage b_id={baby.b_id} ... /> 로 교체해서 사용한다.
 */
function SecureBabyImage({ b_id, alt, className }) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        let objectUrl;
        let cancelled = false;

        const load = async () => {
            try {
                const url = await fetchBabyProfilePhotoBlob(b_id);
                if (!cancelled) {
                    objectUrl = url;
                    setImageUrl(url);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (b_id) {
            load();
        }

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [b_id]);

    if (!imageUrl) return null;

    return <img src={imageUrl} alt={alt} className={className} />;
}

export default SecureBabyImage;