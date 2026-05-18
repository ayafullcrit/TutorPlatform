import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classApi } from '../api/classApi';
import { subjectApi } from '../api/subjectApi';
import ReviewSection from './ReviewSection';
import './ClassListPage.css';

function ClassListPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    subjectId: '',
    grade: '',        // thay level bằng grade (1-12)
    minPrice: '',
    maxPrice: '',
    page: 1,
    pageSize: 12,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadSubjects();
    searchClasses();
  }, []);

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

  const searchClasses = async (newFilters = filters) => {
    setLoading(true);
    try {
      // Chuyển đổi filter grade thành number (nếu có)
      const apiFilters = {
        ...newFilters,
        grade: newFilters.grade ? parseInt(newFilters.grade) : undefined,
        subjectId: newFilters.subjectId ? parseInt(newFilters.subjectId) : undefined,
        minPrice: newFilters.minPrice ? parseFloat(newFilters.minPrice) : undefined,
        maxPrice: newFilters.maxPrice ? parseFloat(newFilters.maxPrice) : undefined,
      };
      const response = await classApi.searchClasses(apiFilters);
      if (response.success) {
        setClasses(response.data.items);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalCount: response.data.totalCount,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
        });
      }
    } catch (error) {
      console.error('Search classes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
      page: 1,
    };
    setFilters(newFilters);
    // Tự động search khi filter thay đổi
    searchClasses(newFilters);
  };

  const handleSearch = () => {
    searchClasses(filters);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    searchClasses(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      keyword: '',
      subjectId: '',
      grade: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
      pageSize: 12,
    };
    setFilters(defaultFilters);
    searchClasses(defaultFilters);
  };

  // Helper để hiển thị grade dạng chữ (tùy chọn)
  const getGradeText = (grade) => {
    if (!grade) return '';
    return `Lớp ${grade}`;
  };

  return (
    <div className="class-list-container">
      {/* Header */}
      <div className="class-list-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Quay lại
        </button>
        <h1>🔍 Tìm Lớp Học</h1>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          {/* Search Keyword */}
          <div className="filter-item">
            <label>Tìm kiếm</label>
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Tên lớp học..."
            />
          </div>

          {/* Subject Filter */}
          <div className="filter-item">
            <label>Môn học</label>
            <select
              name="subjectId"
              value={filters.subjectId}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả môn</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Filter (thay cho level) */}
          <div className="filter-item">
            <label>Khối lớp</label>
            <select
              name="grade"
              value={filters.grade}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
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

          {/* Price Range */}
          <div className="filter-item">
            <label>Giá (VNĐ)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Từ"
                style={{ width: '50%' }}
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Đến"
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn-search" onClick={handleSearch}>
            🔍 Tìm kiếm
          </button>
          <button className="btn-clear" onClick={handleClearFilters}>
            ✖️ Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Results Count */}
      {pagination && (
        <div className="results-info">
          Tìm thấy <strong>{pagination.totalCount}</strong> lớp học
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          {/* Class Cards Grid */}
          {classes.length === 0 ? (
            <div className="no-results">
              <p>😔 Không tìm thấy lớp học nào</p>
              <button className="btn-clear" onClick={handleClearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="class-grid">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="class-card"
                  onClick={() => navigate(`/classes/${classItem.id}`)}
                >
                  {/* Thumbnail */}
                  <div className="class-thumbnail">
                    {classItem.thumbnailUrl ? (
                      <img src={classItem.thumbnailUrl} alt={classItem.title} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        {classItem.subjectIcon || '📚'}
                      </div>
                    )}
                    {/* Hiển thị grade thay vì level */}
                    <div className="class-level-badge">{getGradeText(classItem.grade, classItem.level)}</div>
                  </div>

                  {/* Content */}
                  <div className="class-card-content">
                    <div className="class-subject">
                      {classItem.subjectIcon} {classItem.subjectName}
                    </div>

                    <h3 className="class-title">{classItem.title}</h3>

                    <p className="class-description">
                      {classItem.description && classItem.description.length > 100
                        ? `${classItem.description.substring(0, 100)}...`
                        : classItem.description}
                    </p>

                    {/* Tutor Info */}
                    <div className="class-tutor">
                      <span className="tutor-name">👨‍🏫 {classItem.tutorName}</span>
                      {classItem.tutorRating > 0 && (
                        <span className="tutor-rating">
                          ⭐ {classItem.tutorRating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="class-meta">
                      <span>⏱️ {classItem.durationMinutes} phút</span>
                      <span>
                        👥 {classItem.currentStudents}/{classItem.maxStudents}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="class-footer">
                      <div className="class-price">
                        {classItem.pricePerSession.toLocaleString()} VNĐ
                        <span className="price-label">/buổi</span>
                      </div>

                      {classItem.isFull ? (
                        <span className="badge-full">Đã đầy</span>
                      ) : (
                        <span className="badge-available">Còn chỗ</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-page"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevious}
              >
                ← Trước
              </button>

              <span className="page-info">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>

              <button
                className="btn-page"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClassListPage;