export default function TutorChartCard({ title = "Thu nhập 6 tháng qua" }) {
  return (
    <div className="tutor-chart tutor-card">
      <div className="tutor-chart__header">
        <h3>{title}</h3>
        <select>
          <option>6 tháng qua</option>
          <option>12 tháng qua</option>
        </select>
      </div>

      <div className="tutor-chart__body">
        <svg viewBox="0 0 620 260" preserveAspectRatio="none">
          <path
            d="M20,190 C100,145 155,150 210,165 C275,185 310,95 380,112 C450,130 500,145 600,60"
            fill="none"
            stroke="#7C6E27"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}