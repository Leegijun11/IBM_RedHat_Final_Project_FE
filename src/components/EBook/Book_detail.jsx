import "../../styles/Book_detail.css";
function Book_detail({ book, onClose }) {
    return (
        <div
            style={{
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "20px",
            }}
        >
            <h2>{book.s_name}</h2>

            <hr />

            <p style={{ whiteSpace: "pre-wrap" }}>
                {book.s_content}
            </p>

            <br />

            <button onClick={onClose}>
                닫기
            </button>
        </div>
    );
}

export default Book_detail;