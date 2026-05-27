import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/authService";
import { getProfile, updateProfile, updateTutorProfile } from "../../services/userService";
import "../../styles/student-dashboard.css";

export default function Profile() {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    hourlyRate: "",
  });

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

  const getTutorHourlyRate = (user) =>
    user?.tutor?.hourlyRate ?? user?.Tutor?.HourlyRate ?? user?.hourlyRate ?? 0;

  const openEdit = () => {
    setSaveError("");
    setForm({
      fullName: user?.fullName ?? user?.FullName ?? "",
      phoneNumber: user?.phoneNumber ?? user?.PhoneNumber ?? "",
      address: user?.address ?? user?.Address ?? "",
      hourlyRate: getTutorHourlyRate(user).toString(),
    });
    setEditing(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditing(false);
  };

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaveError("");
      setSaving(true);

      const profilePayload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        avatarUrl: user?.avatarUrl ?? user?.AvatarUrl ?? "",
      };
      const res1 = await updateProfile(profilePayload);
      if (!res1?.success) throw new Error(res1?.message ?? "Cập nhật hồ sơ thất bại");

      const rate = form.hourlyRate === "" ? 0 : Number(form.hourlyRate);
      const res2 = await updateTutorProfile({
        bio: "Tutor Profile", // Satisfy API validation for [Required] Bio field
        education: "",
        experience: "",
        totalReviews: user?.tutor?.totalReviews ?? user?.Tutor?.TotalReviews ?? 0,
        rating: user?.tutor?.rating ?? user?.Tutor?.Rating ?? 5.0,
        hourlyRate: Number.isFinite(rate) ? rate : 0,
        videoIntro: "",
      });
      if (!res2?.success) throw new Error(res2?.message ?? "Cập nhật thông tin gia sư thất bại");

      const nextUser = res2?.data ?? res1?.data ?? user;
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
      setEditing(false);
    } catch (err) {
      setSaveError(err?.message ?? "Có lỗi khi cập nhật hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) return <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>;
  if (!user) return <div style={{ padding: 40, textAlign: "center" }}>Vui lòng đăng nhập</div>;

  const tutorHourlyRate = getTutorHourlyRate(user);

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Hồ sơ cá nhân</h1>
          <p className="tutor-page__subtitle">Quản lý thông tin và hồ sơ chuyên môn.</p>
        </div>
      </div>

      <div className="tutor-card" style={{ padding: 0, overflow: "hidden", marginBottom: "24px" }}>
        <div
          style={{
            height: "150px",
            background: "linear-gradient(90deg, #7C6E27 0%, #D1A751 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            padding: "24px",
            marginTop: "-46px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {user.fullName?.[0] || "T"}
            </div>
            <div>
              <h2 style={{ margin: "18px 0 0", fontSize: "38px", fontWeight: 700 }}>{user.fullName}</h2>
              <p style={{ margin: "6px 0 0", color: "var(--tutor-primary)", fontWeight: 600 }}>
                Gia sư · {user.email}
              </p>
            </div>
          </div>

          <button className="tutor-btn tutor-btn--primary" onClick={openEdit}>
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="tutor-card" style={{ padding: 26 }}>
          <h3>Thông tin liên hệ</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}</p>
          <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
        </div>

        <div className="tutor-card" style={{ padding: 26 }}>
          <h3>Thông tin hệ thống</h3>
          <p><strong>Mã người dùng:</strong> #{user.id}</p>
          <p><strong>Vai trò:</strong> Gia sư</p>
          <p><strong>Học phí:</strong> {tutorHourlyRate ? `${tutorHourlyRate.toLocaleString("vi-VN")} đ/giờ` : "Chưa cập nhật"}</p>
        </div>
      </div>

      {editing ? (
        <div className="student-modal" role="dialog" aria-modal="true">
          <div className="student-modal__content">
            <h2>Chỉnh sửa hồ sơ</h2>
            <p className="student-card__muted">Cập nhật thông tin cá nhân và thông tin gia sư.</p>

            <form className="student-form" onSubmit={handleSave}>
              <label htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                className="student-input"
                value={form.fullName}
                onChange={onChange("fullName")}
                required
              />

              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                id="phoneNumber"
                className="student-input"
                value={form.phoneNumber}
                onChange={onChange("phoneNumber")}
                placeholder="VD: 0123456789"
              />

              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                className="student-input"
                value={form.address}
                onChange={onChange("address")}
                placeholder="VD: Quận 1, TP.HCM"
              />

              <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "14px 0" }} />

              <label htmlFor="hourlyRate">Học phí mỗi giờ (VNĐ)</label>
              <input
                id="hourlyRate"
                className="student-input"
                type="number"
                min="0"
                step="1000"
                value={form.hourlyRate}
                onChange={onChange("hourlyRate")}
                placeholder="VD: 150000"
              />

              {saveError ? <p style={{ color: "#b42318", marginTop: 10 }}>{saveError}</p> : null}

              <div className="student-modal__actions">
                <button type="button" className="student-secondary-btn" onClick={closeEdit} disabled={saving}>
                  Hủy
                </button>
                <button type="submit" className="tutor-btn tutor-btn--primary" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}