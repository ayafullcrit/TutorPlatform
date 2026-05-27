import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";
import { getProfile, updateProfile, updateStudentProfile } from "../../services/userService";

const getStudentSchool = (user) => user?.student?.school ?? user?.Student?.School ?? user?.school ?? "";
const getStudentGrade = (user) =>
  user?.student?.gradeLevel ?? user?.Student?.GradeLevel ?? user?.grade ?? user?.gradeLevel ?? "";

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
    school: "",
    gradeLevel: "",
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await getProfile();
      if (result?.success && result.data) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = () => {
    setSaveError("");
    setForm({
      fullName: user?.fullName ?? user?.FullName ?? "",
      phoneNumber: user?.phoneNumber ?? user?.PhoneNumber ?? "",
      address: user?.address ?? user?.Address ?? "",
      school: getStudentSchool(user),
      gradeLevel: (getStudentGrade(user) ?? "").toString(),
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

      const grade = form.gradeLevel === "" ? 0 : Number(form.gradeLevel);
      const res2 = await updateStudentProfile({
        gradeLevel: Number.isFinite(grade) ? grade : 0,
        school: form.school,
      });
      if (!res2?.success) throw new Error(res2?.message ?? "Cập nhật thông tin học tập thất bại");

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

  const studentSchool = getStudentSchool(user);
  const studentGrade = getStudentGrade(user);

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
              {user.fullName?.[0] || "S"}
            </div>
            <div>
              <h2 style={{ margin: "18px 0 0", fontSize: "38px", fontWeight: 700 }}>{user.fullName}</h2>
              <p style={{ margin: "6px 0 0", color: "var(--color-primary)", fontWeight: 600 }}>
                Học viên · {user.email}
              </p>
            </div>
          </div>

          <button className="student-dashboard__primary-btn" onClick={openEdit}>
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "22px" }}>
        <div className="student-card">
          <h3 className="student-card__title">Thông tin cá nhân</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {user.phoneNumber || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}
          </p>
        </div>

        <div className="student-card">
          <h3 className="student-card__title">Thông tin học tập</h3>
          <p>
            <strong>Mã học viên:</strong> #{user.id}
          </p>
          <p>
            <strong>Trường:</strong> {studentSchool || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Khối lớp:</strong> {studentGrade ? `Lớp ${studentGrade}` : "Chưa cập nhật"}
          </p>

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
                  border: "1px solid #eee",
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

      {editing ? (
        <div className="student-modal" role="dialog" aria-modal="true">
          <div className="student-modal__content">
            <h2>Chỉnh sửa hồ sơ</h2>
            <p className="student-card__muted">Cập nhật thông tin cá nhân và thông tin học tập.</p>

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

              <label htmlFor="school">Trường</label>
              <input
                id="school"
                className="student-input"
                value={form.school}
                onChange={onChange("school")}
                placeholder="VD: THPT Nguyễn Trãi"
              />

              <label htmlFor="gradeLevel">Khối lớp</label>
              <input
                id="gradeLevel"
                className="student-input"
                type="number"
                min="1"
                max="12"
                value={form.gradeLevel}
                onChange={onChange("gradeLevel")}
                placeholder="1-12"
              />

              {saveError ? <p style={{ color: "#b42318", marginTop: 10 }}>{saveError}</p> : null}

              <div className="student-modal__actions">
                <button type="button" className="student-secondary-btn" onClick={closeEdit} disabled={saving}>
                  Hủy
                </button>
                <button type="submit" className="student-dashboard__primary-btn" disabled={saving}>
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

