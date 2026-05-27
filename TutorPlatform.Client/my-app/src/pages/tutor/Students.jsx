import { useState, useEffect } from "react";
import TutorStudentTable from "../../components/tutor/TutorStudentTable";
import TutorRequestCard from "../../components/tutor/TutorRequestCard";
import { getTutorBookings, confirmBooking, cancelBookingByTutor, completeBooking } from "../../services/bookingService";

export default function Students() {
  const [tab, setTab] = useState("list");

  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTutorBookings();
      if (result?.success && result.data) {
        const allBookings = result.data;
        
        // Map bookings to "students" (Confirmed, Completed)
        // BookingStatus: Pending=1, Confirmed=2, Completed=3, Cancelled=4
        const activeStudents = allBookings
          .filter(b => b.status === 2 || b.status === 3)
          .map(b => ({
            id: b.id,
            name: b.studentName || "Học viên",
            subject: b.subjectName || b.classTitle || "Chưa rõ",
            status: b.status === 2 ? "active" : "completed",
            progress: 0, // Backend might not have progress yet
            next: b.startTime ? new Date(b.startTime).toLocaleString("vi-VN") : "Chưa có lịch",
            userId: b.studentUserId,
            startTime: b.startTime,
            bookingStatus: b.status
          }));
          
        // Map bookings to "requests" (Pending)
        const pendingRequests = allBookings
          .filter(b => b.status === 1)
          .map(b => ({
            id: b.id,
            name: b.studentName || "Học viên mới",
            subject: b.subjectName || b.classTitle || "Đăng ký lớp",
            time: b.startTime ? new Date(b.startTime).toLocaleString("vi-VN") : "Gần đây",
            message: b.notes || "Muốn đăng ký học cùng gia sư."
          }));

        setStudents(activeStudents);
        setRequests(pendingRequests);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError("Không thể tải danh sách học viên");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchSearch && matchStatus;
  });



  const handleApproveRequest = async (request) => {
    try {
      const result = await confirmBooking(request.id);
      if (result.success) {
        alert("Đã phê duyệt học viên!");
        loadBookings();
      }
    } catch (err) {
      alert("Lỗi khi phê duyệt: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectRequest = async (request) => {
    if (!window.confirm("Bạn có chắc muốn từ chối yêu cầu này?")) return;
    try {
      const result = await cancelBookingByTutor(request.id);
      if (result.success) {
        alert("Đã từ chối yêu cầu.");
        loadBookings();
      }
    } catch (err) {
      alert("Lỗi khi từ chối: " + (err.response?.data?.message || err.message));
    }
  };

  const handlePauseStudent = (student) => {
    alert("Tính năng này đang được phát triển.");
  };

  const handleDeleteStudent = async (student) => {
    if (!window.confirm("Bạn có chắc muốn hủy lớp học với học viên này?")) return;
    try {
      const result = await cancelBookingByTutor(student.id);
      if (result.success) {
        alert("Đã hủy lớp học.");
        loadBookings();
        setSelectedStudent(null);
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };
  const handleCompleteStudent = async (student) => {
    if (!window.confirm("Đánh dấu buổi học này là đã hoàn thành?")) return;
    try {
      const result = await completeBooking(student.id);
      if (result.success) {
        alert("Đã đánh dấu hoàn thành!");
        loadBookings();
        setSelectedStudent(null);
      } else {
        alert(result.message || "Không thể đánh dấu hoàn thành");
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };


  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Quản lý học viên</h1>
          <p className="tutor-page__subtitle">
            Quản lý danh sách và phê duyệt học viên mới.
          </p>
        </div>


      </div>

      {error && (
        <div style={{ color: "red", marginBottom: 20 }}>{error}</div>
      )}

      <div className="tutor-students__tabs">
        <button
          className={`tutor-students__tab ${
            tab === "list" ? "tutor-students__tab--active" : ""
          }`}
          onClick={() => setTab("list")}
        >
          Danh sách học viên
        </button>

        <button
          className={`tutor-students__tab ${
            tab === "requests" ? "tutor-students__tab--active" : ""
          }`}
          onClick={() => setTab("requests")}
        >
          Duyệt học viên mới
          {requests.length > 0 && (
            <span className="tutor-students__count">{requests.length}</span>
          )}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
      ) : tab === "list" ? (
        <TutorStudentTable
          students={filteredStudents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onViewStudent={setSelectedStudent}
        />
      ) : (
        <div>
          {requests.length === 0 ? (
            <div className="tutor-state tutor-card">
              <span className="material-symbols-outlined tutor-state__icon">
                task_alt
              </span>
              <h3 className="tutor-state__title">Không có yêu cầu mới</h3>
              <p className="tutor-state__text">
                Hiện tại chưa có học viên nào chờ duyệt.
              </p>
            </div>
          ) : (
            requests.map((item) => (
              <TutorRequestCard
                key={item.id}
                item={item}
                onApprove={() => handleApproveRequest(item)}
                onReject={() => handleRejectRequest(item)}
              />
            ))
          )}
        </div>
      )}

      {selectedStudent && (
        <div className="tutor-modal">
          <div className="tutor-modal__content">
            <h2>{selectedStudent.name}</h2>

            <p>
              <strong>Môn học:</strong> {selectedStudent.subject}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedStudent.status === "active" ? "Đang học" : "Đã hoàn thành"}
            </p>
            <p>
              <strong>Buổi gần nhất:</strong> {selectedStudent.next}
            </p>

            <div className="tutor-modal__actions">
              <button
                className="tutor-btn tutor-btn--ghost"
                onClick={() => setSelectedStudent(null)}
              >
                Đóng
              </button>

              {selectedStudent.status === "active" && (
                <button
                  className="tutor-btn tutor-btn--primary"
                  onClick={() => handleCompleteStudent(selectedStudent)}
                >
                  Hoàn thành
                </button>
              )}

              <button
                className="tutor-btn tutor-btn--secondary"
                onClick={() => handlePauseStudent(selectedStudent)}
              >
                Tạm dừng
              </button>

              <button
                className="tutor-btn tutor-btn--danger"
                onClick={() => handleDeleteStudent(selectedStudent)}
              >
                Hủy lớp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
