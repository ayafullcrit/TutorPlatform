import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: 1, // 1 = Student, 2 = Tutor
    grade: 10,
    school: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'number' 
      ? parseInt(e.target.value) 
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {

      const submitData = {
        ...formData,
        role: parseInt(formData.role), 
      };

      console.log('Submitting data:', submitData);
      const response = await authApi.register(submitData);

      if (response.success) {
        // Lưu token và user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Reset form trước khi redirect
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phoneNumber: '',
          role: 1,
          grade: 10,
          school: '',
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('Register error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });

      // Extract error message from various response formats
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';

      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Format: { errors: ["error1", "error2"] }
        errorMessage = err.response.data.errors[0] || errorMessage;
      } else if (err.response?.data?.message) {
        // Format: { message: "error message" }
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.title) {
        // ASP.NET ProblemDetails format
        errorMessage = err.response.data.title;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Đăng Ký</h2>
        <p className="subtitle">Tạo tài khoản mới</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Mật khẩu *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
            />
            {formData.password && formData.password.length < 6 && (
              <p className="input-hint error">Mật khẩu phải có ít nhất 6 ký tự</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Xác nhận mật khẩu *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Phone */}
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

          {/* Role */}
          <div className="form-group">
            <label>Vai trò *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value={1}>Học sinh</option>
              <option value={2}>Gia sư</option>
            </select>
          </div>

          {/* Student-specific fields */}
          {formData.role === 1 && (
            <>
              <div className="form-group">
                <label>Khối lớp</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                  <option value={10}>Lớp 10</option>
                  <option value={11}>Lớp 11</option>
                  <option value={12}>Lớp 12</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trường học</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="THPT Lê Quý Đôn"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <p className="login-link">
          Đã có tài khoản? 
          <a href="/login"> Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;