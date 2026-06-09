import { useMemo } from "react";
import "../../styles/weekly-grid.css";

/**
 * Khung giờ hiển thị: 06:00 → 22:00, mỗi 1 tiếng
 * Tổng 16 hàng: 06, 07, ..., 21 (kết thúc 22:00)
 */
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // [7, 8, ..., 21]
const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/**
 * Thứ tự ngày hiển thị theo chỉ số JS Date.getDay():
 *   JS: 0=CN, 1=T2, 2=T3, ..., 6=T7
 *   Hiển thị: T2(1), T3(2), T4(3), T5(4), T6(5), T7(6), CN(0)
 */
const JS_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const pad = (n) => String(n).padStart(2, "0");
const fmtHour = (h) => `${pad(h)}:00`;

function isSameDay(date, target) {
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

/**
 * WeeklyScheduleGrid
 *
 * ── Chế độ "student" (học viên chọn slot) ────────────────────────────
 * @prop {Date}   weekStart       Ngày thứ 2 của tuần đang hiển thị
 * @prop {Array}  availableSlots  [{startTime, endTime}] ISO – slots gia sư rảnh
 * @prop {object|null} selectedSlot  Slot đang được chọn bởi học viên
 * @prop {Function} onSelectSlot  (slot) => void
 * @prop {string} mode            "student"
 *
 * ── Chế độ "tutor-edit" (gia sư đánh dấu lịch rảnh) ─────────────────
 * @prop {Set<string>} markedCells Set các key "DOW:HH" (DOW = JS dayOfWeek 0-6)
 * @prop {Set<string>} busyCells   Set các key "DOW:HH" đã có booking
 * @prop {Function} onToggleCell   (jsDow, hour) => void
 * @prop {boolean}  isEditing      Có đang ở chế độ chỉnh sửa không
 * @prop {string}   mode           "tutor-edit"
 */
export default function WeeklyScheduleGrid({
  // Week navigation (student mode + optional tutor-edit)
  weekStart = null,
  onPrevWeek,
  onNextWeek,

  // Student mode
  availableSlots = [],
  selectedSlot = null,
  onSelectSlot,

  // Tutor-edit mode
  markedCells = new Set(),
  busyCells = new Set(),
  onToggleCell,
  isEditing = false,

  // Common
  mode = "student",
}) {
  // ── Tính ngày cụ thể cho mỗi cột (T2 → CN) ──
  const weekDates = useMemo(() => {
    if (!weekStart) return JS_DAY_ORDER.map(() => null);
    return JS_DAY_ORDER.map((_, colIdx) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + colIdx);
      return d;
    });
  }, [weekStart]);

  // ── Tập hợp slots rảnh (student mode) ──
  const { availableSet, slotMap } = useMemo(() => {
    if (mode !== "student") return { availableSet: new Set(), slotMap: {} };
    const set = new Set();
    const map = {};
    availableSlots.forEach((slot) => {
      const d = new Date(slot.startTime);
      const jsDow = d.getDay();
      const hour = d.getHours();
      const key = `${jsDow}:${hour}`;
      set.add(key);
      map[key] = slot;
    });
    return { availableSet: set, slotMap: map };
  }, [availableSlots, mode]);

  // ── Xác định class CSS của mỗi ô ──
  const getSlotClass = (jsDow, hour) => {
    const key = `${jsDow}:${hour}`;
    const base = "wgrid-slot";

    if (mode === "student") {
      if (availableSet.has(key)) {
        const slot = slotMap[key];
        const isSelected = selectedSlot?.startTime === slot?.startTime;
        return isSelected
          ? `${base} wgrid-slot--selected`
          : `${base} wgrid-slot--free`;
      }
      return `${base} wgrid-slot--unavailable`;
    }

    // tutor-edit mode
    if (busyCells.has(key)) return `${base} wgrid-slot--busy`;
    if (markedCells.has(key)) {
      return isEditing
        ? `${base} wgrid-slot--marked wgrid-slot--editable`
        : `${base} wgrid-slot--marked`;
    }
    return isEditing
      ? `${base} wgrid-slot--unavailable wgrid-slot--editable`
      : `${base} wgrid-slot--unavailable`;
  };

  const getSlotTitle = (jsDow, hour) => {
    const key = `${jsDow}:${hour}`;
    if (mode === "student") {
      if (availableSet.has(key)) {
        const slot = slotMap[key];
        const e = new Date(slot.endTime);
        const endStr = `${pad(e.getHours())}:${pad(e.getMinutes())}`;
        if (selectedSlot?.startTime === slot?.startTime)
          return `Đang chọn: ${fmtHour(hour)} – ${endStr}`;
        return `Chọn giờ: ${fmtHour(hour)} – ${endStr}`;
      }
      return "Gia sư bận hoặc không có giờ này";
    }
    if (busyCells.has(key)) return "Đã có buổi dạy, không thể chỉnh sửa";
    if (markedCells.has(key))
      return isEditing ? "Đang rảnh – click để bỏ đánh dấu" : "Đã đánh dấu rảnh";
    return isEditing ? "Click để đánh dấu rảnh" : "Chưa đánh dấu";
  };

  // ── Xử lý click ô ──
  const handleSlotClick = (jsDow, hour) => {
    const key = `${jsDow}:${hour}`;

    if (mode === "student") {
      if (!availableSet.has(key)) return;
      const slot = slotMap[key];
      if (selectedSlot?.startTime === slot?.startTime) {
        onSelectSlot?.(null); // bỏ chọn
      } else {
        onSelectSlot?.(slot);
      }
      return;
    }

    // tutor-edit mode
    if (!isEditing) return;
    if (busyCells.has(key)) return; // không toggle ô đã bận
    onToggleCell?.(jsDow, hour);
  };

  // ── Tiêu đề tuần ──
  const weekTitle = useMemo(() => {
    if (!weekStart) return "";
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const fmt = (d) =>
      `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    return `${fmt(weekStart)} – ${fmt(end)}`;
  }, [weekStart]);

  const today = new Date();

  return (
    <div className="wgrid-wrapper">
      {/* Navigation tuần */}
      {(onPrevWeek || onNextWeek) && (
        <div className="wgrid-nav">
          <button
            type="button"
            className="wgrid-nav__btn"
            onClick={onPrevWeek}
            title="Tuần trước"
          >
            ‹
          </button>
          <span className="wgrid-nav__title">
            {weekTitle || "Tuần hiện tại"}
          </span>
          <button
            type="button"
            className="wgrid-nav__btn"
            onClick={onNextWeek}
            title="Tuần sau"
          >
            ›
          </button>
        </div>
      )}

      {/* Scrollable grid */}
      <div className="wgrid-scroll">
        <div className="wgrid-table">
          {/* ── Hàng header: ô trống góc + 7 ngày ── */}
          <div className="wgrid-header wgrid-header--time" />
          {JS_DAY_ORDER.map((jsDow, colIdx) => {
            const date = weekDates[colIdx];
            const isToday = date ? isSameDay(date, today) : false;
            return (
              <div
                key={`hdr-${jsDow}`}
                className={`wgrid-header${isToday ? " wgrid-header--today" : ""}`}
              >
                <div className="wgrid-header__day">{DAY_LABELS[colIdx]}</div>
                {date && (
                  <div className="wgrid-header__date">
                    {isToday ? (
                      <span>{date.getDate()}</span>
                    ) : (
                      `${date.getDate()}/${pad(date.getMonth() + 1)}`
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Các hàng giờ ── */}
          {HOURS.map((hour) => (
            <div key={`row-${hour}`} style={{ display: "contents" }}>
              {/* Nhãn giờ */}
              <div className="wgrid-time">{fmtHour(hour)}</div>

              {/* 7 ô slot */}
              {JS_DAY_ORDER.map((jsDow) => (
                <div
                  key={`slot-${jsDow}-${hour}`}
                  className={getSlotClass(jsDow, hour)}
                  title={getSlotTitle(jsDow, hour)}
                  onClick={() => handleSlotClick(jsDow, hour)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="wgrid-legend">
        {mode === "student" ? (
          <>
            <div className="wgrid-legend__item">
              <div className="wgrid-legend__dot wgrid-legend__dot--free" />
              Gia sư rảnh
            </div>
            <div className="wgrid-legend__item">
              <div className="wgrid-legend__dot wgrid-legend__dot--selected" />
              Đang chọn
            </div>
            <div className="wgrid-legend__item">
              <div className="wgrid-legend__dot wgrid-legend__dot--unavail" />
              Không khả dụng
            </div>
          </>
        ) : (
          <>
            <div className="wgrid-legend__item">
              <div className="wgrid-legend__dot wgrid-legend__dot--marked" />
              Đã đánh dấu rảnh
            </div>
            <div className="wgrid-legend__item">
              <div className="wgrid-legend__dot wgrid-legend__dot--busy" />
              Đã có lịch dạy
            </div>
            <div className="wgrid-legend__item">
              <div className="wgrid-legend__dot wgrid-legend__dot--unavail" />
              Chưa đánh dấu
            </div>
          </>
        )}
      </div>
    </div>
  );
}
