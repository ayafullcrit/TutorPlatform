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

  if (loading && !user) return <div style={{ padding: 40 }}>Đang tải...</div>;
  if (!user) return <div style={{ padding: 40 }}>Vui lòng đăng nhập</div>;

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Hồ sơ cá nhân</h1>
          <p className="tutor-page__subtitle">Quản lý thông tin và hồ sơ chuyên môn.</p>
        </div>

        <button className="tutor-btn tutor-btn--primary">Chỉnh sửa hồ sơ</button>
      </div>

      <div className="tutor-card" style={{ overflow: "hidden", marginBottom: 24 }}>
        <div
          style={{
            height: 150,
            background: "linear-gradient(90deg, #7C6E27, #D1A751)",
          }}
        ></div>

        <div
          style={{
            padding: 26,
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 38,
          }}
        >
          <div style={{
            width: 110,
            height: 110,
            borderRadius: 26,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 700,
            color: "#7C6E27",
            border: "6px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            {user.fullName?.[0] || "T"}
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: 30 }}>{user.fullName}</h2>
            <p style={{ color: "var(--tutor-primary)", fontWeight: 800 }}>
              Gia sư · {user.email}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="tutor-card" style={{ padding: 26 }}>
          <h3>Thông tin liên hệ</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}</p>
          <p><strong>Địa chỉ:</strong> Việt Nam</p>
        </div>

        <div className="tutor-card" style={{ padding: 26 }}>
          <h3>Thông tin hệ thống</h3>
          <p><strong>Mã người dùng:</strong> #{user.id}</p>
          <p><strong>Vai trò:</strong> Gia sư</p>
          <p><strong>Trạng thái:</strong> Đang hoạt động</p>
        </div>
      </div>
    </div>
  );
}