import { useEffect, useMemo, useState } from "react";
import { approveAllWithdrawals, approveWithdrawal, getTransactions, getWithdrawalRequests, rejectWithdrawal } from "../../services/transactionService";

const statusOf = (item) => {
  if (item.status === "completed") return "APPROVED";
  if (item.status === "rejected") return "REJECTED";
  return "PENDING";
};

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.allSettled([getTransactions(), getWithdrawalRequests()]);
      const transactionsResult = a.status === "fulfilled" ? a.value : { success: false, data: [] };
      const withdrawalsResult = b.status === "fulfilled" ? b.value : { success: false, data: [] };
      setTxs(transactionsResult.success ? transactionsResult.data || [] : []);
      setWithdrawals(withdrawalsResult.success ? withdrawalsResult.data || [] : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pendingWithdrawals = useMemo(() => withdrawals.filter((item) => statusOf(item) === "PENDING"), [withdrawals]);

  const handleBulkAccept = async () => {
    await approveAllWithdrawals();
    await load();
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Quản lý giao dịch</h2>
        <p>Xử lý các yêu cầu rút tiền, duyệt hàng loạt và theo dõi toàn bộ luồng tiền trong hệ thống.</p>
      </div>

      <div className="admin-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="admin-stat__label">Đang chờ xử lý</div>
            <div className="admin-stat__value" style={{ fontSize: 32 }}>{pendingWithdrawals.length}</div>
            <div className="admin-stat__sub">Accept tất cả pending hoặc xử lý từng giao dịch bên dưới</div>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleBulkAccept}
            disabled={pendingWithdrawals.length === 0}
          >
            Accept tất cả pending
          </button>
      </div>

      <div className="admin-card" style={{ overflowX: "auto" }}>
        <div className="admin-page__header" style={{ marginBottom: 16 }}>
          <h2>Yêu cầu rút tiền</h2>
          <p>Thao tác từng giao dịch hoặc duyệt hàng loạt khi đã kiểm tra thông tin.</p>
        </div>

        {loading ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--color-text-muted)" }}>Đang tải giao dịch...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Gia sư</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Mô tả</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((item) => {
                const status = statusOf(item);
                return (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.tutorName || "Gia sư"}</td>
                    <td>{item.formattedAmount || `${Number(item.amount || 0).toLocaleString("vi-VN")} VNĐ`}</td>
                    <td>
                      <span className={`admin-badge ${status === "PENDING" ? "admin-badge--inactive" : "admin-badge--active"}`}>
                        {status}
                      </span>
                    </td>
                    <td>{item.description || "N/A"}</td>
                    <td style={{ textAlign: "right" }}>
                      {status === "PENDING" ? (
                        <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn--secondary"
                            onClick={async () => {
                              await approveWithdrawal(item.id);
                              await load();
                            }}
                          >
                            Xử lý
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--secondary"
                            onClick={async () => {
                              await rejectWithdrawal(item.id);
                              await load();
                            }}
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="admin-page__muted">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {withdrawals.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                    Chưa có yêu cầu rút tiền nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card" style={{ overflowX: "auto" }}>
        <div className="admin-page__header" style={{ marginBottom: 16 }}>
          <h2>Lịch sử giao dịch hệ thống</h2>
          <p>Toàn bộ giao dịch phát sinh trong hệ thống.</p>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>ID</th>
              <th>Loại</th>
              <th>Mô tả</th>
              <th style={{ textAlign: "right" }}>Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {txs.slice(0, 20).map((item) => (
              <tr key={item.id}>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "N/A"}</td>
                <td>TXN-{item.id}</td>
                <td>{item.typeText || "Giao dịch"}</td>
                <td>{item.description || "N/A"}</td>
                <td style={{ textAlign: "right" }}>{item.formattedAmount || `${Number(item.amount || 0).toLocaleString("vi-VN")} VNĐ`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
