import React from "react";
import PublicHeader from "../../components/PublicHeader";
import "./About.css";

const values = [
  {
    title: "Uy tín",
    desc: "Gia sư được xác thực hồ sơ và đánh giá rõ ràng.",
    icon: "🛡️",
  },
  {
    title: "Chất lượng",
    desc: "Kết nối học viên với gia sư phù hợp mục tiêu học tập.",
    icon: "🎯",
  },
  {
    title: "Minh bạch",
    desc: "Học phí, lịch học và đánh giá được hiển thị rõ ràng.",
    icon: "✨",
  },
];

const About = () => {
  return (
    <div className="public-page">
      <PublicHeader />

      <section className="about-hero">
        <span className="public-badge">Về EduMatch</span>
        <h1>Kết nối học viên với gia sư chất lượng trên toàn quốc</h1>
        <p>
          EduMatch được xây dựng với mục tiêu giúp việc tìm gia sư trở nên dễ
          dàng, đáng tin cậy và phù hợp hơn với từng người học.
        </p>
      </section>

      <section className="about-mission">
        <div>
          <h2>Sứ mệnh</h2>
          <p>
            Mang đến một nền tảng học tập nơi học viên có thể tìm được gia sư
            phù hợp, còn gia sư có thể quản lý lớp học, lịch dạy và học viên
            một cách hiệu quả.
          </p>
        </div>

        <div>
          <h2>Tầm nhìn</h2>
          <p>
            Trở thành nền tảng kết nối gia sư hiện đại, minh bạch và thân thiện
            với người dùng tại Việt Nam.
          </p>
        </div>
      </section>

      <section className="about-values">
        <h2>Giá trị cốt lõi</h2>

        <div className="value-grid">
          {values.map((item, index) => (
            <div className="value-card" key={index}>
              <div className="value-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-process">
        <h2>Cách EduMatch hoạt động</h2>

        <div className="process-line">
          <div>1. Tìm gia sư</div>
          <div>2. Gửi yêu cầu</div>
          <div>3. Xác nhận lịch</div>
          <div>4. Bắt đầu học</div>
        </div>
      </section>
    </div>
  );
};

export default About;