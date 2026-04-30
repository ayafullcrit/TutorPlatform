export default function StudentTopbar() {
  return (
    <header className="student-topbar">
      <div className="student-topbar__left">
        <h2 className="student-topbar__title">Khu vực học viên</h2>
      </div>

      <div className="student-topbar__right">
        <div className="student-topbar__search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Tìm kiếm khóa học..." />
        </div>

        <button className="student-topbar__icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="student-topbar__avatar">
          <img
            src="https://i.pravatar.cc/80?img=12"
            alt="avatar"
            loading="lazy"
          />
        </div>
      </div>
    </header>
  );
}