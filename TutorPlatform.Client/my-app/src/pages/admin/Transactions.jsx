import { useState, useEffect } from "react";
import { getTransactions, refundPayment } from "../../services/transactionService";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDisbursed: "₫0",
    pendingRequests: 0,
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const result = await getTransactions();
      if (result.data) {
        const allTransactions = result.data;
        setTransactions(allTransactions);

        // Calculate stats
        const totalDisbursed = allTransactions
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        const pending = allTransactions.filter((t) => t.status === "pending").length;

        setStats({
          totalDisbursed: `₫${totalDisbursed.toLocaleString('vi-VN')}`,
          pendingRequests: pending,
        });
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (transactionId) => {
    if (!window.confirm("Xác nhận xử lý thanh toán này?")) return;

    try {
      // Simulate processing - in real app this would call an API
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId ? { ...t, status: "completed" } : t
        )
      );
    } catch (error) {
      console.error("Failed to process payment:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-5xl font-serif text-[#7b5800]">Giao dịch & Rút tiền</h1>
        <p className="mt-3 text-lg text-stone-600 max-w-2xl">
          Quản lý sổ cái tài chính, kiểm tra thanh toán lớp học, và xử lý yêu cầu rút tiền của gia sư.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải giao dịch...</div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#efefd7] p-8 rounded">
              <p className="text-xs uppercase tracking-widest text-stone-500">Tổng Thanh Toán (Tháng)</p>
              <h3 className="mt-4 text-5xl font-serif text-[#7b5800]">{stats.totalDisbursed}</h3>
              <p className="mt-3 text-sm text-stone-500">+12% so với tháng trước</p>
            </div>

            <div className="bg-[#efefd7] p-8 rounded">
              <p className="text-xs uppercase tracking-widest text-stone-500">Hàng Chờ Rút</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-4xl font-serif">{stats.pendingRequests}</span>
                <span className="text-stone-500">Yêu cầu chờ xử lý</span>
              </div>
              <button className="mt-6 w-full bg-[#e1aa36] text-[#5b4000] py-3 rounded">
                Xử lý hàng loạt
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-8 rounded">
            <h2 className="text-3xl font-serif mb-6">Yêu Cầu Rút Tiền Chờ Xử Lý</h2>
            <div className="space-y-4">
              {transactions
                .filter((t) => t.status === "pending")
                .map((transaction) => (
                  <div key={transaction.id} className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-[#fbfbe2] rounded">
                    <div>
                      <h4 className="font-medium">{transaction.tutorName || "Gia sư"}</h4>
                      <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">
                        {transaction.bankInfo || "Thông tin ngân hàng"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-serif text-xl text-[#7b5800]">
                          ₫{(transaction.amount || 0).toLocaleString('vi-VN')}
                        </p>
                        <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                          {transaction.status === "pending" ? "Chờ xử lý" : "Đã xử lý"}
                        </span>
                      </div>
                      {transaction.status === "pending" && (
                        <button
                          className="bg-[#7b5800] text-white px-4 py-2 rounded"
                          onClick={() => handleProcessPayment(transaction.id)}
                        >
                          Xử lý
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="lg:col-span-12 bg-[#efefd7] rounded p-8 overflow-x-auto">
            <h2 className="text-3xl font-serif mb-6">Sổ Cái Chung</h2>
            <table className="w-full">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-stone-500 border-b">
                  <th className="py-4 text-left">Ngày / Giờ</th>
                  <th className="text-left">ID Giao Dịch</th>
                  <th className="text-left">Loại</th>
                  <th className="text-left">Mô Tả</th>
                  <th className="text-right">Số Tiền</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-4">
                      {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td>TXN-{transaction.id}</td>
                    <td>{transaction.type || "Giao dịch"}</td>
                    <td>{transaction.description || "N/A"}</td>
                    <td className={`text-right font-serif ${
                      transaction.type === "withdrawal" ? "text-red-600" : "text-[#7b5800]"
                    }`}>
                      {transaction.type === "withdrawal" ? "-" : "+"}₫{(transaction.amount || 0).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}