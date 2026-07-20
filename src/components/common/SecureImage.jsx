import { useState, useEffect } from "react";
import { fetchImageByPathBlob } from "../../services/secureimages_api";

/**
 * Diary.d_image 처럼 "images/{b_id}/{date}/{filename}" 경로 문자열이
 * 그대로 저장된 데이터를 인증된 요청으로 가져와 표시한다.
 * path가 이미 완전한 http(s) URL(AI 생성 이미지 등)이면 그대로 <img src>에 사용한다.
 */
function SecureImage({ path, alt, className, style }) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!path) {
            setImageUrl(null);
            return;
        }

        // 이미 완전한 URL(외부/AI 생성 이미지)이면 그대로 사용
        if (path.startsWith("http")) {
            setImageUrl(path);
            return;
        }

        let objectUrl;
        let cancelled = false;

        const load = async () => {
            try {
                // 앞의 "../" 반복, 맨 앞 슬래시, 절대경로(C:/.../images/...) 형태를
                // 모두 정리해서 "images/{b_id}/{date}/{filename}" 형태로 맞춘다.
                // (백엔드에서도 한 번 더 같은 방식으로 정규화 및 검증함)
                let cleanPath = path.replace(/\\/g, "/");
                if (cleanPath.includes("/images/")) {
                    cleanPath = "images/" + cleanPath.split("/images/")[1];
                } else {
                    cleanPath = cleanPath.replace(/\.\.\//g, "").replace(/^\/+/, "");
                }

                const url = await fetchImageByPathBlob(cleanPath);
                if (!cancelled) {
                    objectUrl = url;
                    setImageUrl(url);
                }
            } catch (error) {
                console.log(error);
            }
        };

        load();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [path]);

    if (!imageUrl) return null;

    return <img src={imageUrl} alt={alt} className={className} style={style} />;
}

export default SecureImage;