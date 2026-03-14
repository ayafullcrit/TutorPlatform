import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userApi.getProfile();
      if (response.success) {
        setProfile(response.data);
        setFormData({
          fullName: response.data.fullName,
          phoneNumber: response.data.phoneNumber,
          address: response.data.address,
          avatarUrl: response.data.avatarUrl,
        });
      }
    } catch (error) {
      console.error('Load profile error:', error);
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
    setMessage('');

    try {
      const response = await userApi.updateProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setEditing(false);
        setMessage('Cập nhật thành công!');
        
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        user.fullName = response.data.fullName;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      setMessage('Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Thông Tin Cá Nhân</h1>
        {!editing && (
          <button 
            className="btn-edit"
            onClick={() => setEditing(true)}
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {message && (
        <div className="message success">{message}</div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              Lưu thay đổi
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => setEditing(false)}
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-avatar">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName} />
            ) : (
              <div className="avatar-placeholder">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{profile.email}</span>
            </div>

            <div className="info-row">
              <span className="label">Họ và tên:</span>
              <span className="value">{profile.fullName}</span>
            </div>

            <div className="info-row">
              <span className="label">Số điện thoại:</span>
              <span className="value">{profile.phoneNumber || 'Chưa cập nhật'}</span>
            </div>

            <div className="info-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">{profile.address || 'Chưa cập nhật'}</span>
            </div>

            <div className="info-row">
              <span className="label">Vai trò:</span>
              <span className="value">
                {profile.role === 1 ? 'Học sinh' : 'Gia sư'}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Số dư:</span>
              <span className="value">{profile.balance.toLocaleString()} VNĐ</span>
            </div>
          </div>

          {/* Student-specific info */}
          {profile.student && (
            <div className="student-info">
              <h3>Thông tin học sinh</h3>
              <div className="info-row">
                <span className="label">Khối lớp:</span>
                <span className="value">Lớp {profile.student.gradeLevel}</span>
              </div>
              <div className="info-row">
                <span className="label">Trường:</span>
                <span className="value">{profile.student.school || 'Chưa cập nhật'}</span>
              </div>
            </div>
          )}

          {/* Tutor-specific info */}
          {profile.tutor && (
            <div className="tutor-info">
              <h3>Thông tin gia sư</h3>
              <div className="info-row">
                <span className="label">Học phí:</span>
                <span className="value">{profile.tutor.hourlyRate.toLocaleString()} VNĐ/giờ</span>
              </div>
              <div className="info-row">
                <span className="label">Đánh giá:</span>
                <span className="value">⭐ {profile.tutor.rating.toFixed(1)} ({profile.tutor.totalReviews} đánh giá)</span>
              </div>
              <div className="info-row">
                <span className="label">Trạng thái:</span>
                <span className="value">
                  {profile.tutor.isVerified ? '✅ Đã xác minh' : '⏳ Chờ xác minh'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;