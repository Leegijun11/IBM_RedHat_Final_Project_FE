import "../../styles/Book_card.css";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Book_card({ book, onDetailClick, onDeleteClick }) {
    const coverUrl = book.s_fcover && book.s_fcover !== "없음" 
        ? `${BACKEND_URL}/${book.s_fcover}` 
        : null;

    // 🌟 안전하게 테마 번호(1~8)를 추출하는 함수
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

            <div className="book-title-badge">
                <h3 className="book-title">{book.s_name}</h3>
            </div>

            <button className="detail-link-btn" onClick={(e) => {
                e.stopPropagation();
                onDetailClick();
            }}>
                책 디테일 보기 〉
            </button>

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
                <span className="btn-icon">📖</span> 실물 책 주문
            </button>
            
        </div>
    );
}

export default Book_card;