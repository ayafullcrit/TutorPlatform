import { useState, useEffect, useRef } from "react";
import { getTutorEarningsChart } from "../../services/dashboardService";

const W = 620;
const H = 220;
const PAD = { top: 20, right: 20, bottom: 40, left: 60 };

function buildPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

export default function TutorChartCard() {
  const [months, setMonths] = useState(6);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    loadChart();
  }, [months]);

  const loadChart = async () => {
    try {
      setLoading(true);
      const res = await getTutorEarningsChart(months);
      if (res && (res.success || res.Success) && res.data) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Compute chart geometry
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map((d) => Number(d.earnings || d.Earnings || 0)), 1);

  const points = data.map((d, i) => ({
    x: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW,
    y: PAD.top + innerH - (Number(d.earnings || d.Earnings || 0) / maxVal) * innerH,
    label: d.month || d.Month,
    value: Number(d.earnings || d.Earnings || 0),
  }));

  const linePath = buildPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].x},${PAD.top + innerH} L${points[0].x},${PAD.top + innerH} Z`
      : "";

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: PAD.top + innerH - ratio * innerH,
    label: formatMoney(maxVal * ratio),
  }));

  function formatMoney(v) {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return `${v}`;
  }

  const hasData = data.some((d) => Number(d.earnings || d.Earnings || 0) > 0);

  return (
    <div className="tutor-chart tutor-card">
      <div className="tutor-chart__header">
        <h3>Thu nhập {months} tháng qua</h3>
        <div style={{ display: "flex", gap: 8 }}>
          {[6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                background: months === m ? "var(--tutor-primary, #7C6E27)" : "#f0ede4",
                color: months === m ? "#fff" : "#666",
                transition: "all 0.2s",
              }}
            >
              {m} tháng
            </button>
          ))}
        </div>
      </div>

      <div className="tutor-chart__body" style={{ position: "relative", overflow: "hidden" }}>
        {loading ? (
          <div
            style={{
              height: H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: 14,
            }}
          >
            Đang tải dữ liệu...
          </div>
        ) : !hasData ? (
          <div
            style={{
              height: H,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              gap: 8,
            }}
          >
            <span className="material-icons" style={{ fontSize: 40, color: "#ddd" }}>
              trending_up
            </span>
            <span style={{ fontSize: 14 }}>Chưa có dữ liệu thu nhập</span>
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ width: "100%", height: H, display: "block" }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C6E27" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7C6E27" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {gridLines.map((g, i) => (
              <g key={i}>
                <line
                  x1={PAD.left}
                  y1={g.y}
                  x2={W - PAD.right}
                  y2={g.y}
                  stroke="#f0ede4"
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? "none" : "4,4"}
                />
                <text
                  x={PAD.left - 6}
                  y={g.y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#bbb"
                >
                  {g.label}
                </text>
              </g>
            ))}

            {/* Area fill */}
            {areaPath && (
              <path d={areaPath} fill="url(#chartGradient)" />
            )}

            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#7C6E27"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points + month labels */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#fff"
                  stroke="#7C6E27"
                  strokeWidth="2.5"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setTooltip({ x: p.x, y: p.y, label: p.label, value: p.value })}
                  onMouseLeave={() => setTooltip(null)}
                />
                <text
                  x={p.x}
                  y={PAD.top + innerH + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#999"
                >
                  {p.label}
                </text>
              </g>
            ))}

            {/* Tooltip */}
            {tooltip && (
              <g>
                <rect
                  x={Math.min(tooltip.x - 40, W - PAD.right - 90)}
                  y={tooltip.y - 40}
                  width={90}
                  height={30}
                  rx="6"
                  fill="#3d3520"
                  opacity="0.92"
                />
                <text
                  x={Math.min(tooltip.x - 40, W - PAD.right - 90) + 45}
                  y={tooltip.y - 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#fff"
                  fontWeight="600"
                >
                  ₫{tooltip.value.toLocaleString("vi-VN")}
                </text>
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}