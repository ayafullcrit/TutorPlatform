import { getInitials } from "../../utils/avatar";

export default function TutorStudentTable({
  students,
  searchTerm,
  setSearchTerm,
  classFilter,
  setClassFilter,
  uniqueClasses,
  onViewStudent,
}) {
  return (
    <div className="tutor-student-table tutor-card">
      <div className="tutor-student-table__toolbar">
        <div className="tutor-student-table__search">
          <span className="material-symbols-outlined">search</span>
          <input
            placeholder="Tìm tên hoặc lớp học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="tutor-student-table__filter"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="all">Tất cả lớp</option>
          {uniqueClasses && uniqueClasses.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Học viên</th>
            <th>Lớp học</th>
            <th>Buổi kế tiếp</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {students.map((item) => {
            return (
              <tr key={item.id}>
                <td>
                  <div className="tutor-student-table__person">
                    <div
                      className="tutor-student-table__avatar-fallback"
                      aria-label={item.name}
                      title={item.name}
                    >
                      {getInitials(item.name, "S")}
                    </div>
                    <strong>{item.name}</strong>
                  </div>
                </td>

                <td>
                  <span className="tutor-student-table__tag">
                    {item.className}
                  </span>
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
