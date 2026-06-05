const getInitials = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "HV";
};

export default function TutorStudentTable({
  students,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onViewStudent,
}) {
  const statusMap = {
    active: ["Đang học", "tutor-badge--active"],
    pending: ["Chờ lịch", "tutor-badge--pending"],
    suspended: ["Tạm dừng", "tutor-badge--error"],
    completed: ["Đã hoàn thành", "tutor-badge--success"],
  };

  return (
    <div className="tutor-student-table tutor-card">
      <div className="tutor-student-table__toolbar">
        <div className="tutor-student-table__search">
          <span className="material-symbols-outlined">search</span>
          <input
            placeholder="Tìm tên hoặc môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="tutor-student-table__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang học</option>
          <option value="completed">Đã hoàn thành</option>
          <option value="pending">Chờ lịch</option>
          <option value="suspended">Tạm dừng</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Học viên</th>
            <th>Môn học</th>
            <th>Trạng thái</th>
            <th>Tiến độ</th>
            <th>Buổi kế tiếp</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {students.map((item) => {
            const [label, className] =
              statusMap[item.status] || statusMap.active;

            return (
              <tr key={item.id}>
                <td>
                  <div className="tutor-student-table__person">
                    <div
                      className="tutor-student-table__avatar-fallback"
                      aria-label={item.name}
                      title={item.name}
                    >
                      {getInitials(item.name)}
                    </div>
                    <strong>{item.name}</strong>
                  </div>
                </td>

                <td>
                  <span className="tutor-student-table__tag">
                    {item.subject}
                  </span>
                </td>

                <td>
                  <span className={`tutor-badge ${className}`}>
                    {label}
                  </span>
                </td>

                <td>
                  <div className="tutor-student-table__progress-wrap">
                    <span>{item.progress}%</span>
                    <div className="tutor-student-table__progress">
                      <span style={{ width: `${item.progress}%` }}></span>
                    </div>
                  </div>
                </td>

                <td>{item.next}</td>

                <td>
                  <button
                    className="tutor-student-table__menu-btn"
                    onClick={() => onViewStudent(item)}
                  >
                    <span className="material-symbols-outlined">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {students.length === 0 && (
        <div className="tutor-student-table__empty">
          Không tìm thấy học viên phù hợp.
        </div>
      )}
    </div>
  );
}
