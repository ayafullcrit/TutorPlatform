import { useState, useEffect } from "react";
import TutorChartCard from "../../components/tutor/TutorChartCard";
import TutorTransactionItem from "../../components/tutor/TutorTransactionItem";
import { getTutorEarnings } from "../../services/dashboardService";
import { getUserTransactions } from "../../services/transactionService";
import { getCurrentUser } from "../../services/authService";

export default function Finance() {
  const [balance, setBalance] = useState("₫0");
  const [monthIncome, setMonthIncome] = useState("₫0");
  const [pendingFee, setPendingFee] = useState("₫0");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) return;

      // Get earnings data
      const earningsData = await getTutorEarnings(user.id);
      if (earningsData.data) {
        setBalance(earningsData.data.currentBalance || "₫0");
        setMonthIncome(earningsData.data.monthlyIncome || "₫0");
        setPendingFee(earningsData.data.pendingFee || "₫0");
      }

      // Get transactions
      const transactionsData = await getUserTransactions(user.id);
      if (transactionsData.data) {
        setTransactions(transactionsData.data.slice(0, 5));
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải dữ liệu tài chính...</div>
      ) : (
        <>
          <section className="tutor-finance__summary">
            <div className="tutor-finance__balance">
              <p>Số dư hiện tại</p>
              <h2>{balance}</h2>
              <div className="tutor-finance__actions">
                <button onClick={handleWithdraw}>Rút tiền</button>
                <button>Chi tiết</button>
              </div>
            </div>

            <div className="tutor-finance__small-card tutor-card">
              <span className="material-symbols-outlined">trending_up</span>
              <p>Thu nhập tháng này</p>
              <h3>{monthIncome}</h3>
              <small style={{ color: "var(--tutor-success)" }}>+12% so với tháng trước</small>
            </div>

            <div className="tutor-finance__small-card tutor-card">
              <span className="material-symbols-outlined">receipt_long</span>
              <p>Học phí chờ thu</p>
              <h3>{pendingFee}</h3>
              <small style={{ color: "var(--tutor-muted)" }}>Từ các học viên</small>
            </div>
          </section>

          <section className="tutor-finance__grid">
            <TutorChartCard title="Biểu đồ thu nhập 6 tháng" />

            <div className="tutor-transactions tutor-card">
              <h3>Giao dịch gần đây</h3>
              {transactions.length > 0 ? (
                transactions.map((item) => (
                  <TutorTransactionItem 
                    key={item.id} 
                    item={{
                      name: `${item.type}`,
                      amount: item.amount,
                      date: new Date(item.createdAt).toLocaleDateString('vi-VN'),
                      status: item.status,
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