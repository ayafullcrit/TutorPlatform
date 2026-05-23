import React, { useState } from "react";
import PublicHeader from "../../components/PublicHeader";
import "./Tutors.css";

const tutors = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Toán lớp 12",
    rating: "4.9",
    reviews: 126,
    price: "200.000đ/giờ",
    experience: "5 năm kinh nghiệm",
    badge: "Top Tutor",
    desc: "Chuyên luyện thi THPT Quốc gia, giúp học viên mất gốc cải thiện nền tảng Toán.",
    detail:
      "Gia sư có kinh nghiệm dạy Toán lớp 10, 11, 12 và luyện thi đại học. Phương pháp học tập trung vào hiểu bản chất, luyện đề và sửa lỗi sai thường gặp.",
    feedbacks: [
      {
        student: "Minh Anh",
        content:
          "Thầy giảng dễ hiểu, em cải thiện điểm Toán rất rõ sau 2 tháng.",
      },
      {
        student: "Quốc Huy",
        content: "Bài tập sát đề, cách chữa bài rất kỹ và dễ nhớ.",
      },
    ],
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "IELTS Writing",
    rating: "4.8",
    reviews: 98,
    price: "350.000đ/giờ",
    experience: "4 năm kinh nghiệm",
    badge: "IELTS Expert",
    desc: "Chuyên luyện IELTS Writing band 6.5+ với lộ trình cá nhân hóa.",
    detail:
      "Gia sư tập trung sửa lỗi writing theo từng tiêu chí Task Response, Coherence, Lexical Resource và Grammar. Phù hợp với học viên cần tăng band trong thời gian ngắn.",
    feedbacks: [
      {
        student: "Lan Chi",
        content: "Cô sửa bài rất chi tiết, giúp em biết mình sai ở đâu.",
      },
      {
        student: "Hoàng Nam",
        content: "Sau 10 buổi học, writing của em tự tin hơn rất nhiều.",
      },
    ],
  },
  {
    id: 3,
    name: "Lê Minh C",
    subject: "Lập trình Java",
    rating: "5.0",
    reviews: 74,
    price: "300.000đ/giờ",
    experience: "3 năm kinh nghiệm",
    badge: "Project Mentor",
    desc: "Hỗ trợ Java, OOP, WinForms, SQL Server và project sinh viên.",
    detail:
      "Gia sư hướng dẫn từ kiến thức nền tảng đến làm project thực tế, bao gồm phân tích yêu cầu, thiết kế database, code chức năng và debug lỗi.",
    feedbacks: [
      {
        student: "Đức Trí",
        content:
          "Anh hướng dẫn rất thực tế, giúp em hiểu cách làm project rõ hơn.",
      },
      {
        student: "Thanh Bình",
        content: "Giải thích dễ hiểu, đặc biệt là phần OOP và SQL.",
      },
    ],
  },
];

const Tutors = () => {
  const [selectedTutor, setSelectedTutor] = useState(null);

  const closeModal = () => {
    setSelectedTutor(null);
  };

  return (
    <div className="public-page">
      <PublicHeader />

      <section className="tutors-hero">
        <span className="public-badge">Gia sư nổi bật</span>
        <h1>Khám phá những gia sư được học viên đánh giá cao</h1>
        <p>
          Những gia sư nổi bật trên EduMatch được lựa chọn dựa trên hồ sơ,
          kinh nghiệm giảng dạy và phản hồi tích cực từ học viên.
        </p>
      </section>

      <section className="tutor-list-section">
        <div className="section-heading">
          <div>
            <h2>Danh sách gia sư nổi bật</h2>
            <p>Nhấn vào nút xem chi tiết để xem hồ sơ và đánh giá.</p>
          </div>
        </div>

        <div className="tutor-grid">
          {tutors.map((tutor) => (
            <div className="tutor-card" key={tutor.id}>
              <div className="tutor-card-top">
                <div className="tutor-avatar">{tutor.name.charAt(0)}</div>
                <span className="tutor-badge">{tutor.badge}</span>
              </div>

              <h3>{tutor.name}</h3>

              <span className="subject-pill">{tutor.subject}</span>

              <p className="rating">
                ⭐ {tutor.rating} <span>({tutor.reviews} đánh giá)</span>
              </p>

              <p className="tutor-desc">{tutor.desc}</p>

              <div className="tutor-meta">
                <span>{tutor.experience}</span>
                <strong>{tutor.price}</strong>
              </div>

              <button type="button" onClick={() => setSelectedTutor(tutor)}>
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedTutor && (
        <div className="tutor-modal-overlay" onClick={closeModal}>
          <div
            className="tutor-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="tutor-modal-close"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="tutor-modal-header">
              <div className="tutor-modal-avatar">
                {selectedTutor.name.charAt(0)}
              </div>

              <div className="tutor-modal-title">
                <span className="tutor-badge">{selectedTutor.badge}</span>

                <h2>{selectedTutor.name}</h2>

                <p>{selectedTutor.subject}</p>

                <strong>
                  ⭐ {selectedTutor.rating} ({selectedTutor.reviews} đánh giá)
                </strong>
              </div>
            </div>

            <div className="tutor-modal-section">
              <h3>Giới thiệu</h3>
              <p>{selectedTutor.detail}</p>
            </div>

            <div className="tutor-modal-info-grid">
              <div className="tutor-info-box">
                <span>Kinh nghiệm</span>
                <strong>{selectedTutor.experience}</strong>
              </div>

              <div className="tutor-info-box">
                <span>Học phí từ</span>
                <strong>{selectedTutor.price}</strong>
              </div>
            </div>

            <div className="tutor-modal-section">
              <h3>Đánh giá của học viên</h3>

              {selectedTutor.feedbacks.map((feedback, index) => (
                <div className="tutor-feedback-card" key={index}>
                  <strong>{feedback.student}</strong>
                  <p>“{feedback.content}”</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutors;