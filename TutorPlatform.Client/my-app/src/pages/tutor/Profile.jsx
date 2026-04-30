export default function Profile() {
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
            marginTop: -64,
          }}
        >
          <img
            src="/assets/images/avatar-placeholder.png"
            alt=""
            style={{
              width: 110,
              height: 110,
              borderRadius: 26,
              objectFit: "cover",
              border: "6px solid #fff",
            }}
          />

          <div>
            <h2 style={{ margin: 0, fontSize: 30 }}>Trần Minh Thắng</h2>
            <p style={{ color: "var(--tutor-primary)", fontWeight: 800 }}>
              Gia sư Kim Cương · Toán nâng cao
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="tutor-card" style={{ padding: 26 }}>
          <h3>Thông tin liên hệ</h3>
          <p>Email: thang.tutor@example.com</p>
          <p>Số điện thoại: +84 901 234 567</p>
          <p>Địa chỉ: Đà Nẵng, Việt Nam</p>
        </div>

        <div className="tutor-card" style={{ padding: 26 }}>
          <h3>Chuyên môn</h3>
          <p>Toán nâng cao, Vật lý, Luyện thi THPT Quốc Gia</p>
          <p>Kinh nghiệm: 5 năm</p>
          <p>Đánh giá trung bình: 4.9 / 5</p>
        </div>
      </div>
    </div>
  );
}