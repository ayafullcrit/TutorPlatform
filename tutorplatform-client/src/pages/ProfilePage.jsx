import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userApi.getProfile();
      if (response.success) {
        setProfile(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          phoneNumber: response.data.phoneNumber || '',
          address: response.data.address || '',
          avatarUrl: response.data.avatarUrl || '',
        });
      }
    } catch (error) {
      console.error('Load profile error:', error);
      setMessage({ 
        text: 'Không thể tải thông tin profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const response = await userApi.updateProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setEditing(false);
        setMessage({ 
          text: '✅ Cập nhật thành công!', 
          type: 'success' 
        });
        
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        user.fullName = response.data.fullName;
        localStorage.setItem('user', JSON.stringify(user));

        // Auto-hide message after 3 seconds
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      setMessage({ 
        text: '❌ Cập nhật thất bại. Vui lòng thử lại.', 
        type: 'error' 
      });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
      address: profile.address || '',
    });
    setMessage({ text: '', type: '' });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Đang tải thông tin...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="loading">Không tìm thấy thông tin profile</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Quay lại
          </button>
          <h1>Thông Tin Cá Nhân</h1>
        </div>
        {!editing && (
          <button className="btn-edit" onClick={() => setEditing(true)}>
            ✏️ Chỉnh sửa
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Edit Mode */}
      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Basic Info Section */}
          <div className="form-section">
            <h3 className="form-section-title">📋 Thông tin cơ bản</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
                <p className="form-help">Email không thể thay đổi</p>
              </div>

              <div className="form-group">
                <label>
                  Vai trò
                </label>
                <input
                  type="text"
                  value={profile.role === 1 ? 'Học sinh' : profile.role === 2 ? 'Gia sư' : 'Admin'}
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0987654321"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, phường, quận, thành phố"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="profile-view">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="profile-name">{profile.fullName}</h2>
            <p className="profile-email">{profile.email}</p>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            {/* Basic Information */}
            <div className="info-section">
              <h3 className="info-section-title">Thông tin cơ bản</h3>
              <div className="info-grid">
                <div className="info-row">
                  <span className="label">Vai trò</span>
                  <span className={`role-badge ${profile.role === 1 ? 'student' : profile.role === 2 ? 'tutor' : 'admin'}`}>
                    {profile.role === 1 ? '🎓 Học sinh' : 
                     profile.role === 2 ? '👨‍🏫 Gia sư' : 
                     '👑 Admin'}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Số điện thoại</span>
                  <span className="value">
                    {profile.phoneNumber || <span className="text-muted">Chưa cập nhật</span>}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Địa chỉ</span>
                  <span className="value">
                    {profile.address || <span className="text-muted">Chưa cập nhật</span>}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Số dư tài khoản</span>
                  <span className="balance-value">
                    {profile.balance?.toLocaleString() || '0'} VNĐ
                  </span>
                </div>
              </div>
            </div>

            {/* Student-specific info */}
            {profile.student && (
              <div className="info-section">
                <div className="student-info">
                  <h3>Thông tin học sinh</h3>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="label">Khối lớp</span>
                      <span className="value">Lớp {profile.student.gradeLevel}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Trường học</span>
                      <span className="value">
                        {profile.student.school || <span className="text-muted">Chưa cập nhật</span>}
                      </span>
                    </div>
                    {profile.student.learningGoals && (
                      <div className="info-row" style={{ gridColumn: '1 / -1' }}>
                        <span className="label">Mục tiêu học tập</span>
                        <span className="value">{profile.student.learningGoals}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tutor-specific info */}
            {profile.tutor && (
              <div className="info-section">
                <div className="tutor-info">
                  <h3>Thông tin gia sư</h3>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="label">Học phí</span>
                      <span className="value text-success">
                        {profile.tutor.hourlyRate?.toLocaleString() || '0'} VNĐ/giờ
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Đánh giá</span>
                      <span className="rating-value">
                        ⭐ {profile.tutor.rating?.toFixed(1) || '0.0'} 
                        ({profile.tutor.totalReviews || 0} đánh giá)
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Trạng thái</span>
                      <span className={`status-badge ${profile.tutor.isVerified ? 'verified' : 'pending'}`}>
                        {profile.tutor.isVerified ? '✅ Đã xác minh' : '⏳ Chờ xác minh'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Tổng giờ dạy</span>
                      <span className="value">
                        {profile.tutor.totalHoursTaught || 0} giờ
                      </span>
                    </div>
                    {profile.tutor.bio && (
                      <div className="info-row" style={{ gridColumn: '1 / -1' }}>
                        <span className="label">Giới thiệu</span>
                        <span className="value">{profile.tutor.bio}</span>
                      </div>
                    )}
                    {profile.tutor.education && (
                      <div className="info-row" style={{ gridColumn: '1 / -1' }}>
                        <span className="label">Học vấn</span>
                        <span className="value">{profile.tutor.education}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
