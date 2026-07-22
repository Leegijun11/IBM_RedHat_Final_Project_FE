import "../../styles/Book_card.css";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Book_card({ book, onDetailClick, onDeleteClick }) {
  
    const coverUrl = book.s_fcover && book.s_fcover !== "없음" 
        ? `${BACKEND_URL}/${book.s_fcover}` 
        : null;

    return (
        <div className="book-card-container">
            {coverUrl && (
                <div 
                    className="book-card-bg"
                    style={{ backgroundImage: `url(${coverUrl})` }}
                />
            )}

            <button 
                className="book-delete-btn" 
                onClick={(e) => {
                    e.stopPropagation(); 
                    onDeleteClick();
                }}
            >
                삭제
            </button>

            <button className="detail-link-btn" onClick={(e) => {
                e.stopPropagation();
                onDetailClick();
            }}>
                책 디테일 보기 〉
            </button>

            <div className="book-card-content">
                <div className="book-meta-top">
                    <span className="book-icon">📔</span>
                    <span></span>
                </div>
                
                <h3 className="book-title">{book.s_name}</h3>

            </div>

            {/* 메인 코랄색 주문 버튼 */}
            <button className="order-floating-btn" onClick={(e) => e.stopPropagation()}>
                <span className="btn-icon">📖</span> 실물 책 주문
            </button>
        </div>
    );
}

export default Book_card;