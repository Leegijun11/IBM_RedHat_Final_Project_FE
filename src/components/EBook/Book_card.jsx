function Book_card({ book, onDetailClick }) {
  return (
    <div>
      <h3>{book.title}</h3>
      <p>{book.period}</p>
      
      {/* 실물 책 주문 버튼 (기능 미구현) */}
      <button>실물 책 주문</button>
      
      {/* 상세 보기 버튼 (부모 페이지에 알림) */}
      <button onClick={onDetailClick}>책 디테일 보기</button>
    </div>
  );
}

export default Book_card;