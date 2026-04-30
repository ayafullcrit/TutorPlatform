export default function TutorTransactionItem({ item }) {
  const paid = item.status === "paid";

  return (
    <div className="tutor-transaction">
      <div className={`tutor-transaction__icon ${paid ? "tutor-transaction__icon--paid" : "tutor-transaction__icon--pending"}`}>
        <span className="material-symbols-outlined">
          {paid ? "trending_up" : "schedule"}
        </span>
      </div>

      <div className="tutor-transaction__info">
        <strong>{item.name}</strong>
        <span>{item.className}</span>
      </div>

      <div className="tutor-transaction__amount">
        <strong>{item.amount}</strong>
        <span className={paid ? "is-paid" : "is-pending"}>
          {paid ? "Đã đóng" : "Chờ thu"}
        </span>
      </div>
    </div>
  );
}