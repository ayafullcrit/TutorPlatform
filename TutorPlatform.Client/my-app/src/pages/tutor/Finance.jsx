import { useState, useEffect } from "react";
import TutorChartCard from "../../components/tutor/TutorChartCard";
import TutorTransactionItem from "../../components/tutor/TutorTransactionItem";
import { getWallet } from "../../services/transactionService";

export default function Finance() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

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
    alert("Tính năng rút tiền sẽ được cập nhật");
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
                <button>Chi tiết</button>
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
              <h3>0đ</h3>
              <small style={{ color: "var(--tutor-muted)" }}>Về tài khoản ngân hàng</small>
            </div>
          </section>

          <section className="tutor-finance__grid">
            <TutorChartCard title="Biểu đồ thu nhập 6 tháng" />

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
    </div>
  );
}