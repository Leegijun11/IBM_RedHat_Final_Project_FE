// 추가: CSS import
import "../../styles/Book_card.css";

function Book_card({ book, onDetailClick }) {
    return (
        // 수정: 인라인 style 제거 → className="book-card"
        <div className="book-card">

            {/* 추가: 좌측 텍스트 영역 wrapper */}
            <div className="book-cover">

                {/* 수정: className 추가 */}
                <h3 className="book-title">{book.s_name}</h3>

                {/* 추가: 버튼 wrapper */}
                <div className="book-card-actions">

                    {/* 수정: className 추가 */}
                    <button className="order-btn">
                        실물 책 주문
                    </button>

                    {/* 수정: className 추가 */}
                    <button className="detail-btn" onClick={onDetailClick}>
                        책 디테일 보기
                    </button>

                </div>

            </div>

            {/* 추가: 우측 사진 영역 */}
            <div className="book-photo">

                <img
                    className="book-image"
                    src="/images/baby-book.png"
                    alt="baby"
                />

            </div>

        </div>
    );
}

export default Book_card;