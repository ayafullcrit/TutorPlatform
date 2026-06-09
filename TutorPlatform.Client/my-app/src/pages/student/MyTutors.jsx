import { useCallback, useEffect, useState } from "react";
import ErrorState from "../../components/student/ErrorState";
import WeeklyScheduleGrid from "../../components/shared/WeeklyScheduleGrid";
import {
  getAvailableSlots,
  getMyEnrollments,
  leaveClass,
  scheduleSession,
} from "../../services/bookingService";

const formatCurrency = (amount) =>
  `${Number(amount ?? 0).toLocaleString("vi-VN")}đ`;

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function MyTutors() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getMonday(new Date())
  );

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const loadEnrollments = async () => {
    try {
      setLoadError(false);
      setLoading(true);
      const res = await getMyEnrollments();
      const list = res?.success ? res.data ?? [] : [];
      setEnrollments(Array.isArray(list) ? list : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadSlots = useCallback(async (enrollment, weekStart) => {
    if (!enrollment) return;
    setSlotsLoading(true);
    setAvailableSlots([]);
    setSelectedSlot(null);

    try {
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const res = await getAvailableSlots(enrollment.classId, weekStartStr);
      if (res?.success) {
        setAvailableSlots(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const openScheduleModal = (enrollment) => {
    const monday = getMonday(new Date());
    setSelectedEnrollment(enrollment);
    setCurrentWeekStart(monday);
    setShowScheduleModal(true);
    loadSlots(enrollment, monday);
  };

  const handlePrevWeek = () => {
    const newWeek = addDays(currentWeekStart, -7);
    setCurrentWeekStart(newWeek);
    loadSlots(selectedEnrollment, newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = addDays(currentWeekStart, 7);
    setCurrentWeekStart(newWeek);
    loadSlots(selectedEnrollment, newWeek);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedEnrollment || !selectedSlot) return;

    try {
      setIsSubmitting(true);
      const res = await scheduleSession({
        classId: selectedEnrollment.classId,
        startTime: selectedSlot.startTime,
        note: "",
      });

      if (res?.success) {
        alert("Đặt buổi học thành công!");
        setShowScheduleModal(false);
        loadEnrollments();
      } else {
        alert(res?.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLeaveModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowLeaveModal(true);
  };

  const confirmLeaveClass = async () => {
    if (!selectedEnrollment) return;

    try {
      setIsSubmitting(true);
      const res = await leaveClass(selectedEnrollment.enrollmentId);

      if (res?.success) {
        alert("Đã rời lớp thành công!");
        setShowLeaveModal(false);
        loadEnrollments();
      } else {
        alert(res?.message || "Có lỗi xảy ra");
      }
    } catch {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSlotLabel = (slot) => {
    if (!slot) return "";

    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const pad = (value) => String(value).padStart(2, "0");

    return `${dayNames[start.getDay()]}, ${pad(start.getDate())}/${pad(
      start.getMonth() + 1
    )} • ${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(
      end.getHours()
    )}:${pad(end.getMinutes())}`;
  };

  return (
    <div>
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Gia sư đang theo học</h1>
          <p className="student-dashboard__subtext">
            Theo dõi lớp học, đặt buổi học mới và quản lý quá trình học tập.
          </p>
        </div>
      </div>

      {loadError ? (
        <ErrorState onRetry={loadEnrollments} />
      ) : loading ? (
        <div className="student-state">
          <span className="material-symbols-outlined student-state__icon student-reviews__spin">
            progress_activity
          </span>
          <h3 className="student-state__title">Đang tải...</h3>
          <p className="student-state__text">Vui lòng đợi trong giây lát.</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="student-state">
          <span className="material-symbols-outlined student-state__icon">
            school
          </span>
          <h3 className="student-state__title">Bạn chưa đăng ký lớp nào</h3>
          <p className="student-state__text">
            Hãy tìm và đăng ký lớp học với gia sư.
          </p>
        </div>
      ) : (
        <div className="student-list-grid">
          {enrollments.map((enrollment) => {
            const isPending = enrollment.status === 3;

            return (
              <article
                className="student-card student-management-card"
                key={enrollment.enrollmentId}
              >
                <div className="student-management-card__header">
                  <div>
                    <p className="student-card__muted">
                      {enrollment.subjectName} (Lớp {enrollment.grade})
                    </p>
                    <h3 className="student-card__title">
                      {enrollment.tutorName}
                    </h3>
                  </div>

                  {isPending && (
                    <span
                      className="student-badge student-badge--pending"
                      style={{
                        background: "#fff3cd",
                        color: "#856404",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      Chờ duyệt
                    </span>
                  )}
                </div>

                <div className="student-detail-list">
                  <p>
                    <span>Lớp học</span>
                    <strong>{enrollment.classTitle}</strong>
                  </p>
                  <p>
                    <span>Học phí</span>
                    <strong>
                      {formatCurrency(enrollment.pricePerSession)}/buổi
                    </strong>
                  </p>
                  <p>
                    <span>Số buổi/tuần</span>
                    <strong>
                      {enrollment.sessionsBookedThisWeek} /{" "}
                      {enrollment.sessionsPerWeek}
                    </strong>
                  </p>
                  <p>
                    <span>Lịch gần nhất</span>
                    <strong>{enrollment.nextSessionTime || "--"}</strong>
                  </p>
                </div>

                <div
                  className="student-card-actions"
                  style={{ display: "flex", gap: "8px", marginTop: "16px" }}
                >
                  {!isPending && (
                    <button
                      className="student-dashboard__primary-btn"
                      style={{ flex: 1, padding: "8px 12px", fontSize: "14px" }}
                      onClick={() => openScheduleModal(enrollment)}
                      disabled={
                        enrollment.sessionsBookedThisWeek >=
                        enrollment.sessionsPerWeek
                      }
                    >
                      {enrollment.sessionsBookedThisWeek >=
                      enrollment.sessionsPerWeek
                        ? "Hết lượt tuần này"
                        : "Đặt buổi học"}
                    </button>
                  )}

                  <button
                    className="student-secondary-btn"
                    style={{ flex: 1, padding: "8px 12px", fontSize: "14px" }}
                    onClick={() => openLeaveModal(enrollment)}
                  >
                    {isPending ? "Hủy yêu cầu" : "Xin nghỉ"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showScheduleModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              maxWidth: "860px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid #E3DEC6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                  Đặt lịch học
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "13px",
                    color: "#6B6B6B",
                  }}
                >
                  {selectedEnrollment?.classTitle} •{" "}
                  {selectedEnrollment?.tutorName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "22px",
                  color: "#6B6B6B",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {slotsLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6B6B6B",
                  }}
                >
                  <span
                    className="material-symbols-outlined student-reviews__spin"
                    style={{
                      fontSize: "32px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    progress_activity
                  </span>
                  Đang tải lịch rảnh của gia sư...
                </div>
              ) : (
                <WeeklyScheduleGrid
                  mode="student"
                  weekStart={currentWeekStart}
                  availableSlots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  onPrevWeek={handlePrevWeek}
                  onNextWeek={handleNextWeek}
                />
              )}

              {selectedSlot && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px 16px",
                    background: "rgba(124, 110, 39, 0.08)",
                    border: "1px solid rgba(124, 110, 39, 0.25)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#7C6E27",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    event_available
                  </span>
                  Đã chọn: {formatSlotLabel(selectedSlot)}
                </div>
              )}

              {!slotsLoading && availableSlots.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#6B6B6B",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "36px",
                      display: "block",
                      marginBottom: "8px",
                      color: "#E3DEC6",
                    }}
                  >
                    event_busy
                  </span>
                  Gia sư không có lịch rảnh trong tuần này.
                  <br />
                  Hãy thử chuyển sang tuần khác.
                </div>
              )}
            </div>

            <div
              style={{
                padding: "16px 24px 20px",
                borderTop: "1px solid #E3DEC6",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "99px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleScheduleSubmit}
                disabled={isSubmitting || !selectedSlot}
                style={{
                  padding: "10px 28px",
                  borderRadius: "99px",
                  border: "none",
                  background: selectedSlot
                    ? "var(--color-primary, #7C6E27)"
                    : "#ccc",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor:
                    isSubmitting || !selectedSlot ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "background 0.2s",
                }}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận & Trừ tiền"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLeaveModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 20,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Xác nhận nghỉ học</h2>
            <p style={{ marginBottom: 20 }}>
              Bạn có chắc chắn muốn nghỉ lớp{" "}
              <strong>{selectedEnrollment?.classTitle}</strong> không?
              <br />
              <br />
              Tất cả các buổi học chưa diễn ra sẽ bị hủy và bạn sẽ được hoàn
              lại tiền. Hành động này không thể hoàn tác.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 99,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmLeaveClass}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 99,
                  border: "none",
                  background: "#dc3545",
                  color: "#fff",
                  fontWeight: 600,
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận nghỉ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
