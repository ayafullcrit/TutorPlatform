import { useState, useEffect } from "react";
import { getWallet, topUpBalance } from "../../services/transactionService";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const result = await getWallet();
      if (result.success) {
        setWallet(result.data);
      }
    } catch (error) {
      console.error("Failed to load wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount < 10000) {
      alert("Số tiền nạp tối thiểu là 10,000 VNĐ");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await topUpBalance(amount);
      if (result.success) {
        alert(result.message || "Nạp tiền thành công!");
        setTopUpAmount("");
        loadWallet();
      } else {
        alert(result.message || "Nạp tiền thất bại");
      }
    } catch (error) {
      alert("Lỗi khi nạp tiền");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !wallet) {
    return <div style={{ padding: 20 }}>Đang tải thông tin ví...</div>;
  }

  return (
    <div className="student-wallet">
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Ví của tôi</h1>
          <p className="student-dashboard__subtext">
            Quản lý số dư và lịch sử giao dịch của bạn.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        {/* Balance Card */}
        <div className="student-card" style={{ padding: 30, background: "linear-gradient(135deg, #7C6E27, #A89534)", color: "#fff" }}>
          <p style={{ opacity: 0.8, marginBottom: 8 }}>Số dư hiện tại</p>
          <h2 style={{ fontSize: 36, fontWeight: 700 }}>
            {wallet?.balance?.toLocaleString("vi-VN")} <span style={{ fontSize: 20 }}>VNĐ</span>
          </h2>
          <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
            <div>
              <p style={{ opacity: 0.8, fontSize: 13 }}>Đã chi tiêu</p>
              <p style={{ fontWeight: 600 }}>{wallet?.totalSpent?.toLocaleString("vi-VN")}đ</p>
            </div>
            <div>
              <p style={{ opacity: 0.8, fontSize: 13 }}>Tổng tiền nạp</p>
              <p style={{ fontWeight: 600 }}>{wallet?.totalTopUp?.toLocaleString("vi-VN")}đ</p>
            </div>
          </div>
        </div>

        {/* Top-up Form */}
        <div className="student-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Nạp tiền vào ví</h3>
          <form onSubmit={handleTopUp}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>Số tiền muốn nạp (VNĐ)</label>
              <input
                type="number"
                placeholder="Ví dụ: 200000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[100000, 200000, 500000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt.toString())}
                  style={{ padding: "8px", borderRadius: 8, border: "1px solid #ddd", background: "#f9f9f9", fontSize: 13 }}
                >
                  +{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%", padding: 14, borderRadius: 99, border: "none",
                background: "#7C6E27", color: "#fff", fontWeight: 600,
                cursor: "pointer", opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? "Đang xử lý..." : "Nạp tiền ngay"}
            </button>
          </form>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="student-card" style={{ marginTop: 24, padding: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Giao dịch gần đây</h3>
        <div className="transaction-list">
          {wallet?.recentTransactions?.length > 0 ? (
            wallet.recentTransactions.map((tx) => (
              <div key={tx.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 0", borderBottom: "1px solid #f0f0f0"
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: tx.typeColor === "success" ? "#e6f4ea" : "#fce8e6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: tx.typeColor === "success" ? "#1e8e3e" : "#d93025", fontSize: 20
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {tx.typeIcon === "+" ? "add" : "remove"}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{tx.description}</p>
                    <p style={{ fontSize: 12, color: "#999" }}>{tx.timeAgo} · {tx.typeText}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontWeight: 700,
                    color: tx.amount >= 0 ? "#1e8e3e" : "#d93025"
                  }}>
                    {tx.formattedAmount}
                  </p>
                  <p style={{ fontSize: 11, color: "#999" }}>Số dư: {tx.balanceAfter?.toLocaleString()}đ</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
              Chưa có giao dịch nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
