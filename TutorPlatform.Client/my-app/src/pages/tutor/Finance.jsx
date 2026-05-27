import { useState, useEffect } from "react";
import TutorChartCard from "../../components/tutor/TutorChartCard";
import TutorTransactionItem from "../../components/tutor/TutorTransactionItem";
import { getWallet, withdrawBalance } from "../../services/transactionService";

export default function Finance() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const result = await getWallet();
      if (result.success) {
        setWallet(result.data);
      }
    } catch (error) {
      console.error("Failed to load finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = async (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount < 10000) {
      setWithdrawError("Số tiền rút tối thiểu là 10,000đ");
      return;
    }
    if (amount > 50000000) {
      setWithdrawError("Số tiền rút tối đa là 50,000,000đ");
      return;
    }
    if (amount > wallet.balance) {
      setWithdrawError("Số dư tài khoản không đủ");
      return;
    }

    try {
      setSubmitting(true);
      const result = await withdrawBalance(amount);
      if (result.success) {
        alert("Gửi yêu cầu rút tiền thành công!");
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        loadFinanceData();
      } else {
        setWithdrawError(result.message || "Rút tiền thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setWithdrawError(error.response?.data?.message || "Lỗi hệ thống khi rút tiền");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Tài chính & Thu nhập</h1>
          <p className="tutor-page__subtitle">
            Quản lý dòng tiền và học phí từ các lớp học.
          </p>
        </div>

        <button className="tutor-btn tutor-btn--ghost">Xuất báo cáo</button>
      </div>

      {loading && !wallet ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải dữ liệu tài chính...</div>
      ) : (
        <>
          <section className="tutor-finance__summary">
            <div className="tutor-finance__balance">
              <p>Số dư hiện tại</p>
              <h2>{wallet?.balance?.toLocaleString("vi-VN")}đ</h2>
              <div className="tutor-finance__actions">
                <button onClick={handleWithdraw}>Rút tiền</button>
              </div>
            </div>

            <div className="tutor-finance__small-card tutor-card">
              <span className="material-symbols-outlined">trending_up</span>
              <p>Tổng thu nhập</p>
              <h3>{wallet?.totalEarned?.toLocaleString("vi-VN")}đ</h3>
              <small style={{ color: "var(--tutor-success)" }}>Đã quyết toán</small>
            </div>

            <div className="tutor-finance__small-card tutor-card">
              <span className="material-symbols-outlined">receipt_long</span>
              <p>Đã rút tiền</p>
              <h3>{wallet?.totalWithdrawn?.toLocaleString("vi-VN")}đ</h3>
              <small style={{ color: "var(--tutor-muted)" }}>Về tài khoản ngân hàng</small>
            </div>
          </section>

          <section className="tutor-finance__grid">
            <TutorChartCard />

            <div className="tutor-transactions tutor-card">
              <h3>Giao dịch gần đây</h3>
              {wallet?.recentTransactions?.length > 0 ? (
                wallet.recentTransactions.map((item) => (
                  <TutorTransactionItem 
                    key={item.id} 
                    item={{
                      name: item.description,
                      amount: item.amount,
                      date: item.timeAgo,
                      status: item.typeText,
                    }} 
                  />
                ))
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                  Không có giao dịch nào
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Modal Rút Tiền */}
      {showWithdrawModal && (
        <div className="tutor-modal" style={{ display: "flex" }}>
          <div className="tutor-modal__content">
            <h2 style={{ marginBottom: "18px" }}>Rút tiền về tài khoản</h2>
            <form onSubmit={handleConfirmWithdraw}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "700" }}>Số tiền muốn rút (VNĐ)</label>
                <input
                  type="number"
                  min="10000"
                  max="50000000"
                  placeholder="Nhập số tiền muốn rút..."
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                    setWithdrawError("");
                  }}
                  style={{
                    border: "1px solid var(--tutor-border)",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    outline: "none",
                    fontSize: "15px",
                    color: "var(--tutor-text)"
                  }}
                  required
                />
                <span style={{ fontSize: "13px", color: "var(--tutor-muted)" }}>
                  Số dư có thể rút: <strong>{wallet?.balance?.toLocaleString("vi-VN")}đ</strong>
                </span>
                {withdrawError && (
                  <span style={{ fontSize: "14px", color: "red", fontWeight: "600", marginTop: "4px" }}>
                    {withdrawError}
                  </span>
                )}
              </div>
              <div className="tutor-modal__actions" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="tutor-btn tutor-btn--ghost"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount("");
                    setWithdrawError("");
                  }}
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="tutor-btn"
                  style={{
                    background: "var(--tutor-primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}