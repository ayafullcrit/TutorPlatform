const formatCurrency = (amount = 0) =>
  `${Number(amount || 0).toLocaleString("vi-VN")}đ`;

const isPaidStatus = (status = "") => {
  const normalized = String(status).trim().toLowerCase();
  return normalized === "paid" || normalized.includes("đã") || normalized.includes("da");
};

export default function TutorTransactionItem({ item }) {
  const paid = isPaidStatus(item.status);

  return (
    <div className="tutor-transaction">
      <div
        className={`tutor-transaction__icon ${
          paid ? "tutor-transaction__icon--paid" : "tutor-transaction__icon--pending"
        }`}
      >
        <span className="material-symbols-outlined">
          {paid ? "trending_up" : "schedule"}
        </span>
      </div>

      <div className="tutor-transaction__info">
        <strong>{item.name}</strong>
        <span>{item.date || "Đang cập nhật"}</span>
      </div>

      <div className="tutor-transaction__amount">
        <strong>{formatCurrency(item.amount)}</strong>
        <span className={paid ? "is-paid" : "is-pending"}>
          {paid ? "Đã thanh toán" : "Chờ thu"}
        </span>
      </div>
    </div>
  );
}
