import React, { useState } from "react";
import PublicHeader from "../../components/PublicHeader";
import "./Support.css";

const faqs = [
  {
    q: "Làm sao để tìm gia sư?",
    a: "Bạn có thể vào trang Tìm gia sư, chọn môn học, tỉnh thành và gửi yêu cầu đăng ký.",
  },
  {
    q: "EduMatch có lớp nhóm không?",
    a: "Có. Học viên có thể tham gia các lớp nhóm đang mở với lịch học và học phí rõ ràng.",
  },
  {
    q: "Tôi có thể học online không?",
    a: "Có. EduMatch hỗ trợ cả hình thức học online và offline tùy theo gia sư.",
  },
  {
    q: "Nếu cần hỗ trợ thì liên hệ ở đâu?",
    a: "Bạn có thể gửi form hỗ trợ hoặc liên hệ qua email, hotline và Zalo.",
  },
];

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Vấn đề tài khoản",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    console.log("Form submitted:", formData);
    alert("Gửi yêu cầu hỗ trợ thành công! Chúng tôi sẽ liên hệ bạn sớm.");
    setFormData({
      name: "",
      email: "",
      category: "Vấn đề tài khoản",
      message: "",
    });
  };

  return (
    <div className="public-page">
      <PublicHeader />

      <section className="support-hero">
        <span className="public-badge">Trung tâm hỗ trợ</span>
        <h1>Chúng tôi luôn sẵn sàng hỗ trợ bạn</h1>
        <p>
          Tìm câu trả lời nhanh hoặc gửi yêu cầu hỗ trợ nếu bạn gặp vấn đề khi
          sử dụng EduMatch.
        </p>
      </section>

      <section className="support-content">
        <div className="faq-box">
          <h2>Câu hỏi thường gặp</h2>

          {faqs.map((item, index) => (
            <div className="faq-item" key={index}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>

        <div className="support-form">
          <h2>Gửi yêu cầu hỗ trợ</h2>

          <input 
            placeholder="Họ và tên" 
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input 
            placeholder="Email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <select name="category" value={formData.category} onChange={handleChange}>
            <option>Vấn đề tài khoản</option>
            <option>Vấn đề thanh toán</option>
            <option>Vấn đề lớp học</option>
            <option>Báo lỗi hệ thống</option>
          </select>

          <textarea 
            placeholder="Nội dung cần hỗ trợ"
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button onClick={handleSubmit}>Gửi yêu cầu</button>
        </div>
      </section>
    </div>
  );
};

export default Support;