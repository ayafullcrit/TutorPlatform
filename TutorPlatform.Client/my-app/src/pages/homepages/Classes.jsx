import React from "react";
import PublicHeader from "../../components/PublicHeader";
import "./Classes.css";

const classes = [
  {
    title: "IELTS Intensive 6.5+",
    tutor: "Trần Thị B",
    schedule: "T3 - T5 - T7",
    students: "6/10 học viên",
    price: "2.500.000đ/tháng",
  },
  {
    title: "Toán 12 luyện thi THPT",
    tutor: "Nguyễn Văn A",
    schedule: "T2 - T4 - T6",
    students: "8/12 học viên",
    price: "1.800.000đ/tháng",
  },
  {
    title: "Java cơ bản đến nâng cao",
    tutor: "Lê Minh C",
    schedule: "T7 - CN",
    students: "5/8 học viên",
    price: "2.000.000đ/tháng",
  },
];

const Classes = () => {
  return (
    <div className="public-page">
      <PublicHeader />

      <section className="classes-hero">
        <div>
          <span className="public-badge">Lớp nhóm EduMatch</span>
          <h1>Học cùng bạn bè, tiết kiệm hơn và hiệu quả hơn</h1>
          <p>
            Tham gia các lớp nhóm chất lượng cao với gia sư được xác thực,
            lịch học rõ ràng và học phí minh bạch.
          </p>
        </div>

        <div className="class-stats">
          <div>
            <h2>1500+</h2>
            <p>Lớp đang mở</p>
          </div>
          <div>
            <h2>850+</h2>
            <p>Gia sư</p>
          </div>
          <div>
            <h2>4.9</h2>
            <p>Đánh giá</p>
          </div>
        </div>
      </section>

      <section className="classes-section">
        <h2>Lớp nhóm nổi bật</h2>

        <div className="class-grid">
          {classes.map((item, index) => (
            <div className="class-card" key={index}>
              <div className="class-tag">Đang tuyển học viên</div>
              <h3>{item.title}</h3>
              <p>👨‍🏫 Gia sư: {item.tutor}</p>
              <p>📅 Lịch học: {item.schedule}</p>
              <p>👥 Số lượng: {item.students}</p>
              <h4>{item.price}</h4>
              <button>Xem chi tiết lớp</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Classes;