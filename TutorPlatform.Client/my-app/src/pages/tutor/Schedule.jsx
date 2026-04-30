export default function Schedule() {
  const days = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CHỦ NHẬT"];

  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Lịch trình giảng dạy</h1>
          <p className="tutor-page__subtitle">Theo dõi các buổi học trong tháng.</p>
        </div>

        <button className="tutor-btn tutor-btn--primary">Thêm lịch dạy</button>
      </div>

      <div className="tutor-card" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {days.map((day) => (
            <div
              key={day}
              style={{
                padding: 16,
                textAlign: "center",
                fontWeight: 800,
                color: "var(--tutor-muted)",
                borderBottom: "1px solid var(--tutor-border)",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {Array.from({ length: 35 }).map((_, index) => (
            <div
              key={index}
              style={{
                minHeight: 115,
                padding: 12,
                borderRight: "1px solid var(--tutor-border)",
                borderBottom: "1px solid var(--tutor-border)",
                color: "var(--tutor-muted)",
              }}
            >
              {index + 1 <= 31 ? index + 1 : ""}

              {[8, 15, 22].includes(index) && (
                <div
                  style={{
                    marginTop: 10,
                    background: "rgba(124,110,39,.12)",
                    color: "var(--tutor-primary)",
                    borderRadius: 10,
                    padding: 8,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  IELTS Writing
                  <div style={{ fontWeight: 500 }}>14:00 - 15:30</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}