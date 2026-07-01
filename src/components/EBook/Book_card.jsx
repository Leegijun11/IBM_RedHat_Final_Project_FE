import "../../styles/Book_card.css";

function Book_card({ book, onDetailClick }) {
    return (
        <div className="book-card-container">
            {/* 우측 상단 디테일 보기 버튼 (디자인을 해치지 않는 반투명 스타일) */}
            <button className="detail-link-btn" onClick={onDetailClick}>
                책 디테일 보기 〉
            </button>

            <div className="book-card-content">
                <div className="book-meta-top">
                    <span className="book-icon">📔</span>
                    <span className="book-vol">VOL. 1</span>
                </div>
                
                <h3 className="book-title">{book.s_name}</h3>

            </div>

            {/* 메인 코랄색 주문 버튼 */}
            <button className="order-floating-btn">
                <span className="btn-icon">📖</span> 실물 책 주문
            </button>
        </div>
    );
}

export default Book_card;