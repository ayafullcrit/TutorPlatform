export default function Profile() {
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
            <img
              src="/assets/images/avatar-placeholder.png"
              alt="avatar"
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "24px",
                objectFit: "cover",
                border: "5px solid #fff",
              }}
            />
            <div>
              <h2 style={{ margin: 0, fontSize: "38px", fontWeight: 700 }}>Nguyễn Thành Trung</h2>
              <p style={{ margin: "6px 0 0", color: "var(--color-primary)", fontWeight: 600 }}>
                Học viên Premium
              </p>
            </div>
          </div>

          <button className="student-dashboard__primary-btn">Chỉnh sửa hồ sơ</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "22px" }}>
        <div className="student-card">
          <h3 className="student-card__title">Thông tin liên hệ</h3>
          <p>Email: trung.nt@example.com</p>
          <p>Số điện thoại: +84 901 234 567</p>
          <p>Địa chỉ: Quận 7, TP. Hồ Chí Minh</p>
        </div>

        <div className="student-card">
          <h3 className="student-card__title">Thành tích đạt được</h3>
          <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            {["Chuyên cần", "Top 10 Tuần", "Siêng năng", "Cộng tác"].map((item) => (
              <div
                key={item}
                style={{
                  minWidth: "110px",
                  textAlign: "center",
                  background: "var(--color-surface-soft)",
                  padding: "18px 12px",
                  borderRadius: "14px",
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