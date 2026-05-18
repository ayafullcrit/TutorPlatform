import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classApi } from '../api/classApi';
import { subjectApi } from '../api/subjectApi';
import './EditClassPage.css';

function EditClassPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    level: '1',
    language: 'Tiếng Việt',
    pricePerSession: '',
    durationMinutes: 90,
    totalSessions: '',
    maxStudents: 10,
    status: 2,
    isOpenForBooking: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    checkTutorRole();
    loadSubjects();
    loadClassData();
  }, [id]);

  const checkTutorRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 2) {
      alert('Chỉ gia sư mới có thể chỉnh sửa lớp học!');
      navigate('/dashboard');
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await subjectApi.getAllSubjects();
      if (response.success) {
        setSubjects(response.data);
      }
    } catch (error) {
      console.error('Load subjects error:', error);
    }
  };

  const loadClassData = async () => {
    try {
      const response = await classApi.getClassById(id);
      if (response.success) {
        const classData = response.data;
        
        // Check ownership
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (classData.tutorUserId !== user.id) {
          alert('Bạn không có quyền chỉnh sửa lớp học này!');
          navigate('/tutor/classes');
          return;
        }

        setFormData({
          subjectId: classData.subjectId,
          title: classData.title,
          description: classData.description,
          thumbnailUrl: classData.thumbnailUrl || '',
          level: classData.level,
          language: classData.language,
          pricePerSession: classData.pricePerSession,
          durationMinutes: classData.durationMinutes,
          totalSessions: classData.totalSessions || '',
          maxStudents: classData.maxStudents,
          status: classData.status,
          isOpenForBooking: classData.isOpenForBooking,
        });
      }
    } catch (error) {
      console.error('Load class error:', error);
      alert('Không thể tải thông tin lớp học!');
      navigate('/tutor/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subjectId) {
      newErrors.subjectId = 'Vui lòng chọn môn học';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Tiêu đề không được quá 200 ký tự';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Mô tả không được quá 2000 ký tự';
    }

    if (!formData.pricePerSession || formData.pricePerSession <= 0) {
      newErrors.pricePerSession = 'Vui lòng nhập giá hợp lệ';
    }

    if (!formData.durationMinutes || formData.durationMinutes < 30 || formData.durationMinutes > 300) {
      newErrors.durationMinutes = 'Thời lượng phải từ 30-300 phút';
    }

    if (!formData.maxStudents || formData.maxStudents < 1 || formData.maxStudents > 50) {
      newErrors.maxStudents = 'Số học viên phải từ 1-50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Convert to numbers
      const submitData = {
        ...formData,
        subjectId: parseInt(formData.subjectId),
        level: parseInt(formData.level),
        pricePerSession: parseFloat(formData.pricePerSession),
        durationMinutes: parseInt(formData.durationMinutes),
        totalSessions: formData.totalSessions ? parseInt(formData.totalSessions) : null,
        maxStudents: parseInt(formData.maxStudents),
        status: parseInt(formData.status),
      };

      const response = await classApi.updateClass(id, submitData);

      if (response.success) {
        alert('✅ Cập nhật lớp học thành công!');
        navigate('/tutor/classes');
      }
    } catch (error) {
      console.error('Update class error:', error);
      alert('❌ Cập nhật lớp học thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-class-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="edit-class-container">
      {/* Header */}
      <div className="edit-class-header">
        <button className="btn-back" onClick={() => navigate('/tutor/classes')}>
          ← Quay lại
        </button>
        <h1>✏️ Chỉnh Sửa Lớp Học</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="edit-class-form">
        {/* Basic Info Section */}
        <div className="form-section">
          <h3 className="section-title">📋 Thông tin cơ bản</h3>

          <div className="form-row">
            {/* Subject */}
            <div className="form-group">
              <label>
                Môn học <span className="required">*</span>
              </label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className={errors.subjectId ? 'error' : ''}
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjectId && <span className="error-text">{errors.subjectId}</span>}
            </div>

            {/* Level */}
            <div className="form-group">
              <label>Cấp lớp</label>
              <select name="level" value={formData.level} onChange={handleChange}>
                <option value="1">Lớp 1</option>
                <option value="2">Lớp 2</option>
                <option value="3">Lớp 3</option>
                <option value="4">Lớp 4</option>
                <option value="5">Lớp 5</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>
              Tiêu đề <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Lớp Toán 10 - Hàm số và Đồ thị"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
            <span className="char-count">{formData.title.length}/200</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>
              Mô tả <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Mô tả chi tiết về lớp học, nội dung, phương pháp giảng dạy..."
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
            <span className="char-count">{formData.description.length}/2000</span>
          </div>

          {/* Thumbnail URL */}
          <div className="form-group">
            <label>Link ảnh thumbnail (URL)</label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Language */}
          <div className="form-group">
            <label>Ngôn ngữ giảng dạy</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Tiếng Việt"
            />
          </div>
        </div>

        {/* Pricing & Schedule Section */}
        <div className="form-section">
          <h3 className="section-title">💰 Giá & Lịch trình</h3>

          <div className="form-row">
            {/* Price */}
            <div className="form-group">
              <label>
                Giá mỗi buổi (VNĐ) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="pricePerSession"
                value={formData.pricePerSession}
                onChange={handleChange}
                placeholder="150000"
                min="0"
                step="1000"
                className={errors.pricePerSession ? 'error' : ''}
              />
              {errors.pricePerSession && (
                <span className="error-text">{errors.pricePerSession}</span>
              )}
            </div>

            {/* Duration */}
            <div className="form-group">
              <label>
                Thời lượng (phút) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                placeholder="90"
                min="30"
                max="300"
                className={errors.durationMinutes ? 'error' : ''}
              />
              {errors.durationMinutes && (
                <span className="error-text">{errors.durationMinutes}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Total Sessions */}
            <div className="form-group">
              <label>Tổng số buổi (tùy chọn)</label>
              <input
                type="number"
                name="totalSessions"
                value={formData.totalSessions}
                onChange={handleChange}
                placeholder="20"
                min="1"
              />
              <span className="form-help">Để trống nếu không giới hạn</span>
            </div>

            {/* Max Students */}
            <div className="form-group">
              <label>
                Số học viên tối đa <span className="required">*</span>
              </label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                placeholder="10"
                min="1"
                max="50"
                className={errors.maxStudents ? 'error' : ''}
              />
              {errors.maxStudents && <span className="error-text">{errors.maxStudents}</span>}
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="form-section">
          <h3 className="section-title">⚙️ Trạng thái</h3>

          <div className="form-row">
            {/* Status */}
            <div className="form-group">
              <label>Trạng thái lớp học</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value={1}>Nháp</option>
                <option value={2}>Hoạt động</option>
                <option value={3}>Tạm dừng</option>
                <option value={4}>Hoàn thành</option>
                <option value={5}>Đã hủy</option>
              </select>
            </div>

            {/* Is Open For Booking */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isOpenForBooking"
                  checked={formData.isOpenForBooking}
                  onChange={handleChange}
                />
                <span>Mở đăng ký</span>
              </label>
              <span className="form-help">
                Cho phép học sinh đăng ký lớp này
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/tutor/classes')}
          >
            Hủy
          </button>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditClassPage;