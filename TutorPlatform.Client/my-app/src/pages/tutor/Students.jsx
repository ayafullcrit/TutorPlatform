import { useState } from "react";
import TutorStudentTable from "../../components/tutor/TutorStudentTable";
import TutorRequestCard from "../../components/tutor/TutorRequestCard";
import { tutorStudents, tutorRequests } from "../../mock/mockTutorStudents";

export default function Students() {
  const [tab, setTab] = useState("list");

  const [students, setStudents] = useState(tutorStudents);
  const [requests, setRequests] = useState(tutorRequests);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleAddStudent = (e) => {
    e.preventDefault();

    const form = e.target;

    const newStudent = {
      name: form.name.value,
      subject: form.subject.value,
      status: "active",
      progress: Number(form.progress.value) || 0,
      next: form.next.value || "Chưa có lịch",
    };

    setStudents([newStudent, ...students]);
    setIsAddOpen(false);
    form.reset();
  };

  const handleApproveRequest = (request) => {
    const newStudent = {
      name: request.name,
      subject: request.subject,
      status: "active",
      progress: 0,
      next: "Chờ xếp lịch",
    };

    setStudents([newStudent, ...students]);
    setRequests(requests.filter((item) => item.name !== request.name));
  };

  const handleRejectRequest = (request) => {
    setRequests(requests.filter((item) => item.name !== request.name));
  };

  const handlePauseStudent = (student) => {
    setStudents(
      students.map((item) =>
        item.name === student.name
          ? { ...item, status: "suspended", next: "Đang tạm dừng" }
          : item
      )
    );
  };

  const handleDeleteStudent = (student) => {
    setStudents(students.filter((item) => item.name !== student.name));
    setSelectedStudent(null);
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

        <button
          className="tutor-btn tutor-btn--primary"
          onClick={() => setIsAddOpen(true)}
        >
          <span className="material-symbols-outlined">person_add</span>
          Thêm học viên
        </button>
      </div>

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

      {tab === "list" ? (
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
                key={item.name}
                item={item}
                onApprove={() => handleApproveRequest(item)}
                onReject={() => handleRejectRequest(item)}
              />
            ))
          )}
        </div>
      )}

      {isAddOpen && (
        <div className="tutor-modal">
          <div className="tutor-modal__content">
            <h2>Thêm học viên mới</h2>

            <form onSubmit={handleAddStudent}>
              <label>Tên học viên</label>
              <input
                name="name"
                required
                placeholder="VD: Nguyễn Văn An"
              />

              <label>Môn học</label>
              <input
                name="subject"
                required
                placeholder="VD: Toán lớp 12"
              />

              <label>Tiến độ ban đầu (%)</label>
              <input
                name="progress"
                type="number"
                min="0"
                max="100"
                placeholder="VD: 20"
              />

              <label>Buổi kế tiếp</label>
              <input
                name="next"
                placeholder="VD: 14:00 - Mai"
              />

              <div className="tutor-modal__actions">
                <button
                  type="button"
                  className="tutor-btn tutor-btn--ghost"
                  onClick={() => setIsAddOpen(false)}
                >
                  Hủy
                </button>

                <button type="submit" className="tutor-btn tutor-btn--primary">
                  Thêm học viên
                </button>
              </div>
            </form>
          </div>
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
              <strong>Trạng thái:</strong> {selectedStudent.status}
            </p>
            <p>
              <strong>Tiến độ:</strong> {selectedStudent.progress}%
            </p>
            <p>
              <strong>Buổi kế tiếp:</strong> {selectedStudent.next}
            </p>

            <div className="tutor-modal__actions">
              <button
                className="tutor-btn tutor-btn--ghost"
                onClick={() => setSelectedStudent(null)}
              >
                Đóng
              </button>

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
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}