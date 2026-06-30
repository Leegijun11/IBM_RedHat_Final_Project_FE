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
            <div className="baby-header-wrap">
                <p>안녕하세요 👋</p>
            </div>
        );
    }

    return (
        <div className="baby-header-wrap">
            {baby.b_image && (
                <img
                    src={getImageUrl(baby.b_image)}
                    alt={baby.b_name}
                    className="baby-header-img"
                />
            )}
            <div className="baby-header-info">
                <p>안녕하세요 👋</p>
                <h2>{baby.b_name} · {calculateAge(baby.b_birth)}</h2>
            </div>
        </div>
    );
}

export default Baby_header;