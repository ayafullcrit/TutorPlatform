import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classApi } from '../api/classApi';
import './ClassDetailPage.css';

function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassDetail();
  }, [id]);

  const loadClassDetail = async () => {
    try {
      const response = await classApi.getClassById(id);
      if (response.success) {
        setClassData(response.data);
      }
    } catch (error) {
      console.error('Load class detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    // TODO: Navigate to booking page
    alert('Tính năng đặt lớp sẽ được phát triển ở module tiếp theo!');
  };

  if (loading) {
    return (
      <div className="class-detail-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="class-detail-container">
        <div className="loading">Không tìm thấy lớp học</div>
      </div>
    );
  }

  return (
    <div className="class-detail-container">
      {/* Header */}
      <div className="class-detail-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>

      <div className="class-detail-content">
        {/* Main Info */}
        <div className="class-detail-main">
          {/* Thumbnail */}
          <div className="detail-thumbnail">
            {classData.thumbnailUrl ? (
              <img src={classData.thumbnailUrl} alt={classData.title} />
            ) : (
              <div className="thumbnail-placeholder-large">
                {classData.subjectIcon || '📚'}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="detail-header-info">
            <div className="detail-subject-badge">
              {classData.subjectIcon} {classData.subjectName}
            </div>

            <h1 className="detail-title">{classData.title}</h1>

            {/* Grade and other meta - thay level và language */}
            <div className="detail-meta-row">
              <span className="level-badge">Lớp {classData.grade}</span>
              <span className="views">👁️ {classData.viewCount || 0} lượt xem</span>
            </div>

            {/* Tutor Info */}
            <div className="detail-tutor-card">
              <div className="tutor-avatar">
                {classData.tutorAvatar ? (
                  <img src={classData.tutorAvatar} alt={classData.tutorName} />
                ) : (
                  <div className="avatar-placeholder">
                    {classData.tutorName ? classData.tutorName.charAt(0) : 'G'}
                  </div>
                )}
              </div>
              <div className="tutor-info">
                <div className="tutor-name">👨‍🏫 {classData.tutorName}</div>
                {classData.tutorRating > 0 && (
                  <div className="tutor-rating">
                    ⭐ {classData.tutorRating.toFixed(1)} 
                    ({classData.tutorTotalReviews} đánh giá)
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="detail-description">
              <h3>📝 Mô tả lớp học</h3>
              <p>{classData.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="class-detail-sidebar">
          {/* Booking Card */}
          <div className="booking-card">
            <div className="booking-price">
              {classData.pricePerSession.toLocaleString()} VNĐ
              <span className="price-unit">/buổi</span>
            </div>

            {classData.isFull ? (
              <div className="status-full">
                ❌ Lớp đã đầy
              </div>
            ) : (
              <button className="btn-book" onClick={handleBooking}>
                📚 Đặt lớp ngay
              </button>
            )}

            {/* Class Info */}
            <div className="booking-info-list">
              <div className="info-item">
                <span className="info-label">⏱️ Thời lượng:</span>
                <span className="info-value">{classData.durationMinutes} phút</span>
              </div>

              {classData.totalSessions && (
                <div className="info-item">
                  <span className="info-label">📅 Tổng số buổi:</span>
                  <span className="info-value">{classData.totalSessions} buổi</span>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">👥 Học viên:</span>
                <span className="info-value">
                  {classData.currentStudents}/{classData.maxStudents}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">💺 Còn chỗ:</span>
                <span className="info-value available">
                  {classData.availableSlots} chỗ
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">📊 Trạng thái:</span>
                <span className={`status-badge ${classData.status === 2 ? 'active' : ''}`}>
                  {classData.statusText}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <h4>ℹ️ Thông tin thêm</h4>
            <ul>
              <li>✅ Cam kết chất lượng giảng dạy</li>
              <li>💯 Hoàn tiền nếu không hài lòng</li>
              <li>📱 Hỗ trợ học online</li>
              <li>📚 Tài liệu học tập miễn phí</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassDetailPage;