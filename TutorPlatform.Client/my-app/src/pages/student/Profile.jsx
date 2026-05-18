import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/authService";
import { getProfile } from "../../services/userService";

export default function Profile() {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await getProfile();
      if (result?.success && result.data) {
        setUser(result.data);
        // Sync back to localStorage
        localStorage.setItem("user", JSON.stringify(result.data));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: "center" }}>Vui lòng đăng nhập</div>;

  return (
    <div className="student-profile">
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Hồ sơ cá nhân</h1>
        </div>
      </div>

      <div className="student-card" style={{ padding: 0, overflow: "hidden", marginBottom: "24px" }}>
        <div
          style={{
            height: "150px",
            background: "linear-gradient(90deg, #7C6E27 0%, #D1A751 100%)",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "24px", marginTop: "-46px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{
              width: "92px",
              height: "92px",
              borderRadius: "24px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              color: "#7C6E27",
              border: "5px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              {user.fullName?.[0] || "S"}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "38px", fontWeight: 700 }}>{user.fullName}</h2>
              <p style={{ margin: "6px 0 0", color: "var(--color-primary)", fontWeight: 600 }}>
                Học viên · {user.email}
              </p>
            </div>
          </div>

          <button className="student-dashboard__primary-btn">Chỉnh sửa hồ sơ</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "22px" }}>
        <div className="student-card">
          <h3 className="student-card__title">Thông tin liên hệ</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}</p>
          <p><strong>Địa chỉ:</strong> Việt Nam</p>
        </div>

        <div className="student-card">
          <h3 className="student-card__title">Thông tin học tập</h3>
          <p><strong>Mã học viên:</strong> #{user.id}</p>
          <p><strong>Trường:</strong> {user.school || "Chưa cập nhật"}</p>
          <p><strong>Khối lớp:</strong> {user.grade ? `Lớp ${user.grade}` : "Chưa cập nhật"}</p>
          
          <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            {["Chuyên cần", "Siêng năng"].map((item) => (
              <div
                key={item}
                style={{
                  minWidth: "110px",
                  textAlign: "center",
                  background: "#fafaf2",
                  padding: "18px 12px",
                  borderRadius: "14px",
                  border: "1px solid #eee"
                }}
              >
                <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
                  military_tech
                </span>
                <div style={{ marginTop: "8px", fontSize: "14px" }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}