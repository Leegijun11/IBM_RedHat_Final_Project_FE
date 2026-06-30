function Book_card({ book, onDetailClick }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
            }}
        >
            <h3>{book.s_name}</h3>

            <button>
                실물 책 주문
            </button>

            <button onClick={onDetailClick}>
                책 디테일 보기
            </button>
        </div>
    );
}

export default Book_card;