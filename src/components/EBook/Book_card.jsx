import "../../styles/Book_card.css";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Book_card({ book, onDetailClick, onDeleteClick }) {
    const coverUrl = book.s_fcover && book.s_fcover !== "없음" 
        ? `${BACKEND_URL}/${book.s_fcover}` 
        : null;

    const getThemeNum = (coverString) => {
        if (!coverString || coverString === "없음") return "1";
        const match = coverString.match(/fcover(\d+)/);
        return match ? match[1] : "1";
    };
    
    const themeNum = getThemeNum(book.s_fcover);

    return (
        <div className={`book-card-container theme-${themeNum}`}>

            {coverUrl && (
                <div className="book-card-bg-wrap">
                    <div 
                        className="book-card-bg"
                        style={{ backgroundImage: `url(${coverUrl})` }}
                    />
                    <div className="book-card-bg-tone" />
                    <div className="book-card-bg-light" />
                    <div className="book-card-bg-vignette" />
                </div>
            )}

            <button className="detail-link-btn" onClick={(e) => {
                e.stopPropagation();
                onDetailClick();
            }}>
                책 디테일 보기 〉
            </button>

            {/* 실제 책 표지처럼 - 이미지 위에 제목만 직접 */}
            <div className="book-title-wrap">
                <span className="book-title-eyebrow">DEAR BABY STORY</span>
                <h3 className="book-title">{book.s_name}</h3>
            </div>

            <button 
                className="book-delete-btn" 
                onClick={(e) => {
                    e.stopPropagation(); 
                    onDeleteClick();
                }}
            >
                삭제
            </button>

            <button className="order-floating-btn" onClick={(e) => e.stopPropagation()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                실물 책 주문
            </button>
            
        </div>
    );
}

export default Book_card;