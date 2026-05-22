import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classApi } from '../api/classApi';
import './MyClassesPage.css';

function MyClassesPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  useEffect(() => {
    checkTutorRole();
    loadMyClasses();
  }, []);

  const checkTutorRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 2) {
      alert('Chỉ gia sư mới có thể truy cập trang này!');
      navigate('/dashboard');
    }
  };

  const loadMyClasses = async () => {
    try {
      const response = await classApi.getMyClasses();
      console.log('Get my classes response:', response);

      if (response.success) {
        setClasses(response.data || []);
      } else {
        console.error('Error from API:', response.message);
        alert('❌ Lỗi: ' + (response.message || 'Không thể tải danh sách lớp học'));
      }
    } catch (error) {
      console.error('Load my classes error:', error);
      if (error.response?.status === 401) {
        alert('❌ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
      } else {
        alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/tutor/classes/create');
  };

  const handleEdit = (classId) => {
    navigate(`/tutor/classes/edit/${classId}`);
  };

  const handleViewDetail = (classId) => {
    navigate(`/classes/${classId}`);
  };

  const handleDeleteClick = (classItem) => {
    setClassToDelete(classItem);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;

    try {
      const response = await classApi.deleteClass(classToDelete.id);
      if (response.success) {
        // Remove from list or reload
        setClasses(classes.filter(c => c.id !== classToDelete.id));
        setDeleteModalOpen(false);
        setClassToDelete(null);
        alert('✅ Xóa lớp học thành công!');
      }
    } catch (error) {
      console.error('Delete class error:', error);
      alert('❌ Xóa lớp học thất bại: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusBadge = (status, statusText) => {
    // Ưu tiên dùng statusText từ API nếu có
    if (statusText) {
      const textLower = statusText.toLowerCase();
      const statusMap = {
        'active': { text: 'Hoạt động', class: 'status-active' },
        'draft': { text: 'Nháp', class: 'status-draft' },
        'inactive': { text: 'Tạm dừng', class: 'status-inactive' },
        'completed': { text: 'Hoàn thành', class: 'status-completed' },
        'cancelled': { text: 'Đã hủy', class: 'status-cancelled' },
      };
      const statusInfo = statusMap[textLower];
      if (statusInfo) {
        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
      }
    }

    // Fallback: dùng status code (số)
    const statusMap = {
      0: { text: 'Nháp', class: 'status-draft' },
      1: { text: 'Hoạt động', class: 'status-active' },
      2: { text: 'Hoạt động', class: 'status-active' },
      3: { text: 'Tạm dừng', class: 'status-inactive' },
      4: { text: 'Hoàn thành', class: 'status-completed' },
      5: { text: 'Đã hủy', class: 'status-cancelled' },
    };
    const statusInfo = statusMap[status] || { text: 'Không rõ', class: '' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getLevelText = (level) => {
    if (!level && level !== 0) return '';
    const levelNum = typeof level === 'string' ? parseInt(level) : level;
    return `Lớp ${levelNum}`;
  };

  if (loading) {
    return (
      <div className="my-classes-container">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="my-classes-container">
      {/* Header */}
      <div className="my-classes-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Quay lại
          </button>
          <h1>📚 Lớp Học Của Tôi</h1>
        </div>
        <button className="btn-create-new" onClick={handleCreateNew}>
          ➕ Tạo lớp mới
        </button>
      </div>

      {/* Stats */}
      <div className="classes-stats">
        <div className="stat-card">
          <div className="stat-value">{classes.length}</div>
          <div className="stat-label">Tổng lớp học</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {classes.filter(c => c.statusText?.toLowerCase() === 'active' || c.status === 2).length}
          </div>
          <div className="stat-label">Đang hoạt động</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {classes.reduce((sum, c) => sum + (c.currentStudents || 0), 0)}
          </div>
          <div className="stat-label">Tổng học viên</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {classes.reduce((sum, c) => sum + (c.viewCount || 0), 0)}
          </div>
          <div className="stat-label">Lượt xem</div>
        </div>
      </div>

      {/* Classes List */}
      {classes.length === 0 ? (
        <div className="no-classes">
          <div className="no-classes-icon">📚</div>
          <p>Bạn chưa tạo lớp học nào</p>
          <button className="btn-create-new" onClick={handleCreateNew}>
            ➕ Tạo lớp học đầu tiên
          </button>
        </div>
      ) : (
        <div className="classes-table-container">
          <table className="classes-table">
            <thead>
              <tr>
                <th>Lớp học</th>
                <th>Môn học</th>
                <th>Giá</th>
                <th>Học viên</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.id}>
                  {/* Class Info */}
                  <td className="class-info-cell">
                    <div className="class-thumbnail-small">
                      {classItem.thumbnailUrl ? (
                        <img src={classItem.thumbnailUrl} alt={classItem.title} />
                      ) : (
                        <div className="thumbnail-placeholder-small">
                          {classItem.subjectIcon || '📚'}
                        </div>
                      )}
                    </div>
                    <div className="class-info">
                      <div className="class-title-small">{classItem.title}</div>
                      <div className="class-meta-small">
                        <span>{getLevelText(classItem.grade)}</span>
                        <span>•</span>
                        <span>{classItem.durationMinutes} phút</span>
                      </div>
                    </div>
                  </td>

                  {/* Subject */}
                  <td>
                    <span className="subject-badge">
                      {classItem.subjectIcon || '📚'} {classItem.subjectName}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="price-cell">
                    {classItem.pricePerSession.toLocaleString()} VNĐ
                  </td>

                  {/* Students */}
                  <td className="students-cell">
                    <span className={classItem.isFull ? 'full' : ''}>
                      {classItem.currentStudents}/{classItem.maxStudents}
                    </span>
                  </td>

                  {/* Views */}
                  <td>{classItem.viewCount || 0}</td>

                  {/* Status */}
                  <td>{getStatusBadge(classItem.status, classItem.statusText)}</td>

                  {/* Actions */}
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-view"
                      onClick={() => handleViewDetail(classItem.id)}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(classItem.id)}
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteClick(classItem)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa lớp học <strong>"{classToDelete?.title}"</strong>?
            </p>
            {classToDelete?.currentStudents > 0 && (
              <p className="warning-text">
                ⚠️ Lớp học này có {classToDelete.currentStudents} học viên. 
                Lớp sẽ được đánh dấu là "Đã hủy" thay vì xóa hoàn toàn.
              </p>
            )}
            <div className="modal-actions">
              <button
                className="btn-cancel-modal"
                onClick={() => setDeleteModalOpen(false)}
              >
                Hủy
              </button>
              <button className="btn-confirm-delete" onClick={handleDeleteConfirm}>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyClassesPage;