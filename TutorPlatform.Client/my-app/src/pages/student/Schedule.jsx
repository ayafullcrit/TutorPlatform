export default function Schedule() {
  const days = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CHỦ NHẬT"];

  return (
    <div>
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Lịch trình học tập</h1>
          <p className="student-dashboard__subtext">
            Xem và quản lý các buổi học của bạn.
          </p>
        </div>

        <button className="student-dashboard__primary-btn">
          <span className="material-symbols-outlined">add</span>
          Đăng ký lịch mới
        </button>
      </div>

      <div className="student-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid var(--color-border)" }}>
          {days.map((day) => (
            <div
              key={day}
              style={{
                padding: "14px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                borderRight: "1px solid var(--color-border)",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              style={{
                minHeight: "110px",
                borderRight: "1px solid var(--color-border)",
                borderBottom: "1px solid var(--color-border)",
                padding: "10px",
                color: "var(--color-text-muted)",
                fontSize: "13px",
              }}
            >
              {i + 1 <= 31 ? i + 1 : ""}
              {i === 15 || i === 22 ? (
                <div
                  style={{
                    marginTop: "10px",
                    background: "rgba(124,110,39,0.12)",
                    color: "var(--color-primary)",
                    padding: "8px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  IELTS Writing
                  <div style={{ fontSize: "11px", marginTop: "4px" }}>14:00 - 15:30</div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}