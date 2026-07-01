import "../../styles/Book_detail.css"; // 🔥 스타일 파일 연결

function Book_detail({ book, onClose }) {
    return (
        <div className="book-detail-overlay">
            <div className="book-detail-container">
                <h2 className="detail-title">{book.s_name}</h2>
                <hr className="detail-divider" />

                <div className="detail-content-wrapper">
                    <p className="detail-content">
                        {book.s_content}
                    </p>
                </div>

                <button className="close-btn" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
}

export default Book_detail;