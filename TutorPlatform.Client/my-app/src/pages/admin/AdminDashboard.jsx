import { useState, useEffect } from "react";
import { getAdminStats } from "../../services/dashboardService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    registeredTutors: 0,
    activeStudents: 0,
    totalRevenue: "₫0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      const result = await getAdminStats();
      if (result.data) {
        setStats({
          registeredTutors: result.data.totalTutors || 0,
          activeStudents: result.data.totalStudents || 0,
          totalRevenue: `₫${(result.data.totalRevenue || 0).toLocaleString('vi-VN')}`,
        });
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-5xl font-serif text-[#1b1d0e]">Tổng Quan</h2>
        <p className="mt-2 text-lg text-stone-600">
          Tổng hợp thông tin về hệ thống: gia sư, học viên và doanh thu.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải thông tin...</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded">
            <p className="text-xs uppercase tracking-widest text-stone-500">Gia Sư Đã Đăng Ký</p>
            <h3 className="mt-4 text-5xl text-[#7b5800] font-serif">{stats.registeredTutors}</h3>
            <p className="mt-3 text-sm text-stone-500">+12% trong kỳ này</p>
          </div>

          <div className="bg-white p-8 rounded">
            <p className="text-xs uppercase tracking-widest text-stone-500">Học Viên Hoạt Động</p>
            <h3 className="mt-4 text-5xl text-[#7b5800] font-serif">{stats.activeStudents}</h3>
            <p className="mt-3 text-sm text-stone-500">+8% trong kỳ này</p>
          </div>

          <div className="bg-white p-8 rounded">
            <p className="text-xs uppercase tracking-widest text-stone-500">Tổng Doanh Thu</p>
            <h3 className="mt-4 text-5xl text-[#7b5800] font-serif">{stats.totalRevenue}</h3>
            <p className="mt-3 text-sm text-stone-500">Đã thanh toán</p>
          </div>
        </section>
      )}
    </div>
  );
}