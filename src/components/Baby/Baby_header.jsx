import { useState, useEffect } from "react";
import { getCurrentBaby } from "../../services/partner_api";
import SecureBabyImage from "../common/Securebabyimage";

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
                <div className="baby-header-info">
                    {/* 🌟 육아 앱 테마에 완벽하게 어울리는 '귀여운 아기 얼굴' SVG 적용 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px 0', color: '#F07C60' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="13" r="8"/>
                            <path d="M9.5 12h.01"/>
                            <path d="M14.5 12h.01"/>
                            <path d="M10 15.5c.5.5 1.5 1 2 1s1.5-.5 2-1"/>
                            <path d="M12 5c0 2-1 3-3 3"/>
                        </svg>
                        <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.3px' }}>안녕하세요</span>
                    </div>
                    <h2 style={{ margin: '0', fontSize: '18px', color: '#333333' }}>환영합니다</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="baby-header-wrap">
            {baby.b_image && (
                <SecureBabyImage
                    b_id={baby.b_id}
                    alt={baby.b_name}
                    className="baby-header-img"
                />
            )}
            <div className="baby-header-info">
                {/* 🌟 육아 앱 테마에 완벽하게 어울리는 '귀여운 아기 얼굴' SVG 적용 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px 0', color: '#F07C60' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="13" r="8"/>
                        <path d="M9.5 12h.01"/>
                        <path d="M14.5 12h.01"/>
                        <path d="M10 15.5c.5.5 1.5 1 2 1s1.5-.5 2-1"/>
                        <path d="M12 5c0 2-1 3-3 3"/>
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.3px' }}>안녕하세요</span>
                </div>
                <h2 style={{ margin: '0', fontSize: '18px', color: '#333333', letterSpacing: '-0.3px' }}>
                    {baby.b_name} · {calculateAge(baby.b_birth)}
                </h2>
            </div>
        </div>
    );
}

export default Baby_header;