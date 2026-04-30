export default function TutorTopbar() {
  return (
    <header className="tutor-topbar">
      <div className="tutor-topbar__search">
        <span className="material-symbols-outlined">search</span>
        <input placeholder="Tìm kiếm lớp học, học viên, hóa đơn..." />
      </div>

      <div className="tutor-topbar__actions">
        <button className="tutor-topbar__icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="tutor-topbar__profile">
          <img src="https://i.pravatar.cc/100?img=12" alt="Tutor avatar" />
          <div>
            <div className="tutor-topbar__name">Trần Minh Thắng</div>
            <div className="tutor-topbar__role">Gia sư kim cương</div>
          </div>
        </div>
      </div>
    </header>
  );
}