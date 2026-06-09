import { useState, useEffect } from "react";
import TutorStudentTable from "../../components/tutor/TutorStudentTable";
import TutorRequestCard from "../../components/tutor/TutorRequestCard";
import { getTutorEnrollments, approveEnrollment, rejectEnrollment, removeStudent } from "../../services/bookingService";
import { getAvatarSrc } from "../../utils/avatar";

export default function Students() {
  const [tab, setTab] = useState("requests"); // Default to requests

  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadEnrollments(true);
    const interval = setInterval(() => {
      loadEnrollments(false);
    }, 5000); // Poll every 5 seconds for real-time updates
    return () => clearInterval(interval);
  }, [tab]);

  const loadEnrollments = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      setError(null);
      const result = await getTutorEnrollments();
      if (result?.success && result.data) {
        const allEnrollments = result.data;
        
        // EnrollmentStatus: Active = 1, Pending = 3
        const activeStudents = allEnrollments
          .filter(e => e.status === 1)
          .map(e => ({
            id: e.enrollmentId,
            name: e.studentName || "Học viên",
            className: e.classTitle || "Chưa rõ",
            subject: e.subjectName || "Chưa rõ",
            status: "active",
            next: e.nextSessionTime || "Chưa có lịch",
            userId: e.studentUserId,
          }));
          
        const pendingRequests = allEnrollments
          .filter(e => e.status === 3)
          .map(e => ({
            id: e.enrollmentId,
            name: e.studentName || "Học viên mới",
            subject: e.classTitle || "Đăng ký lớp",
            time: new Date(e.enrolledAt).toLocaleString("vi-VN"),
            note: "Muốn đăng ký vào lớp học."
          }));

        setStudents(activeStudents);
        setRequests(pendingRequests);
        
        // Auto switch tab if requests exist (only switch on initial load/action)
        if (showSpinner) {
          if (pendingRequests.length > 0 && tab === "list") {
              setTab("requests");
          } else if (pendingRequests.length === 0 && tab === "requests") {
              setTab("list");
          }
        }
      }
    } catch (err) {
      console.error("Failed to load enrollments:", err);
      setError("Không thể tải danh sách học viên");
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const uniqueClasses = Array.from(new Set(students.map(s => s.className).filter(Boolean)));

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase());

    const matchClass =
      classFilter === "all" || student.className === classFilter;

    return matchSearch && matchClass;
  });

  const handleApproveRequest = async (request) => {
    try {
      const result = await approveEnrollment(request.id);
      if (result.success) {
        alert("Đã phê duyệt học viên vào lớp!");
        loadEnrollments();
      } else {
        alert(result.message || "Không thể phê duyệt");
      }
    } catch (err) {
      alert("Lỗi khi phê duyệt: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectRequest = async (request) => {
    if (!window.confirm("Bạn có chắc muốn từ chối yêu cầu đăng ký lớp này?")) return;
    try {
      const result = await rejectEnrollment(request.id);
      if (result.success) {
        alert("Đã từ chối yêu cầu.");
        loadEnrollments();
      } else {
        alert(result.message || "Không thể từ chối");
      }
    } catch (err) {
      alert("Lỗi khi từ chối: " + (err.response?.data?.message || err.message));
    }
  };

  const handlePauseStudent = (student) => {
    alert("Tính năng đang phát triển.");
  };

  const handleRemoveStudent = async (student) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${student.name}" khỏi lớp "${student.className}"? Tiền các buổi chưa học sẽ được hoàn lại cho học viên.`)) return;
    try {
      const result = await removeStudent(student.id);
      if (result.success) {
        alert("Đã xóa học viên khỏi lớp!");
        setSelectedStudent(null);
        loadEnrollments(true);
      } else {
        alert(result.message || "Không thể xóa học viên");
      }
    } catch (err) {
      alert("Lỗi khi xóa học viên: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteStudent = async (student) => {
    alert("Tính năng ngừng lớp của học viên đang phát triển.");
  };
  
  const handleCompleteStudent = async (student) => {
    alert("Để hoàn thành buổi học, hãy vào menu Lịch Dạy.");
  };


  return (
    <div>
      <div className="tutor-page__header">
        <div>
          <h1 className="tutor-page__title">Quản lý học viên</h1>
          <p className="tutor-page__subtitle">
            Phê duyệt học viên đăng ký lớp và xem danh sách lớp hiện tại.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: 20 }}>{error}</div>
      )}

      <div className="tutor-students__tabs">
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

        <button
          className={`tutor-students__tab ${
            tab === "list" ? "tutor-students__tab--active" : ""
          }`}
          onClick={() => setTab("list")}
        >
          Học viên trong lớp
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
      ) : tab === "list" ? (
        <TutorStudentTable
          students={filteredStudents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          classFilter={classFilter}
          setClassFilter={setClassFilter}
          uniqueClasses={uniqueClasses}
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
              <strong>Lớp học:</strong> {selectedStudent.className}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedStudent.status === "active" ? "Đang học" : "Đã hoàn thành"}
            </p>
            <p>
              <strong>Lịch học gần nhất:</strong> {selectedStudent.next}
            </p>

            <div className="tutor-modal__actions">
              <button
                className="tutor-btn tutor-btn--ghost"
                onClick={() => setSelectedStudent(null)}
              >
                Đóng
              </button>

              <button
                className="tutor-btn tutor-btn--danger"
                onClick={() => handleRemoveStudent(selectedStudent)}
              >
                Xóa học viên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
