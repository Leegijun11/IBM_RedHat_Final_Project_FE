function Book_detail({ book, onClose }) {
  return (
    <div>
      <h3>{book.title} 상세 보기</h3>
      {/* 상세 데이터 렌더링 영역 */}
      <button onClick={onClose}>닫기</button>
    </div>
  );
}

export default Book_detail;