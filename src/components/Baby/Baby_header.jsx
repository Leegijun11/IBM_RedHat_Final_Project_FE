import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/user_api";
import { getImageUrl } from "../../hooks/imageUrl";
import { getCurrentBaby } from "../../Services/partner_api";
function calculateAge(birthDateStr) {
    const birth = new Date(birthDateStr);
    const today = new Date();

    let months =
        (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth());

    if (today.getDate() < birth.getDate()) {
        months -= 1;
    }

    const years = Math.floor(months / 12);
    const remainMonths = months % 12;

    // 일 수 계산 (며칠인지)
    const diffDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));

    if (years > 0) {
        return `${years}세 ${remainMonths}개월`;
    }
    return `${remainMonths}개월 ${diffDays % 30}일`;
}

function Baby_header() {
    const [baby, setBaby] = useState(null);

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const result = await getCurrentBaby();
                setBaby(result);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBaby();
    }, []);

    if (!baby) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <p>안녕하세요 👋</p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            {baby.b_image && (
                <img
                    src={getImageUrl(baby.b_image)}
                    alt={baby.b_name}
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                />
            )}
            <div>
                <p>안녕하세요 👋</p>
                <h2>{baby.b_name} · {calculateAge(baby.b_birth)}</h2>
            </div>
        </div>
    );
}

export default Baby_header;