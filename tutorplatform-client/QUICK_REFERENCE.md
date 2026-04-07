# 📋 Quick Reference - Level Changes (Cấp lớp)

## 🎯 Tổng quan thay đổi

| Yếu tố | Cũ | Mới |
|--------|----|----|
| **Loại level** | String (Beginner/Intermediate/Advanced) | Number (1-12) |
| **Default value** | `'Beginner'` | `'1'` |
| **Dropdown options** | 3 options | 12 options (Lớp 1-12) |
| **API submit** | `level: 'Beginner'` | `level: 1` (integer) |
| **Display** | `classItem.level` → "Beginner" | `getLevelText(classItem.level)` → "Lớp 1" |

---

## 📝 Các file thay đổi

### 1. CreateClassPage.jsx
```javascript
// formData.level: '1' (string, selected in dropdown)
// ↓
// submitData.level: parseInt(formData.level) = 1 (number)
// ↓
// API: POST /class { level: 1, ... }
```

### 2. EditClassPage.jsx
```javascript
// Load: classData.level = 5 (from API)
// → formData.level = 5 (stored in state)
// ↓
// submitData.level: parseInt(formData.level) = 5 (number)
// ↓
// API: PUT /class/id { level: 5, ... }
```

### 3. MyClassesPage.jsx
```javascript
// Hàm helper:
const getLevelText = (level) => {
  const levelNum = typeof level === 'string' ? parseInt(level) : level;
  return `Lớp ${levelNum}`;
};

// Display: {getLevelText(classItem.level)}
// Kết quả: "Lớp 5"
```

### 4. ClassDetailPage.jsx
```javascript
// Hàm helper:
const getLevelText = (level) => {
  const levelNum = typeof level === 'string' ? parseInt(level) : level;
  return `Lớp ${levelNum}`;
};

// Display: {getLevelText(classData.level)}
// Kết quả: "Lớp 9"
```

### 5. ClassListPage.jsx
```javascript
// Hàm helper (cập nhật):
const getGradeText = (grade, level) => {
  const gradeValue = grade || level;
  const gradeNum = typeof gradeValue === 'string' ? parseInt(gradeValue) : gradeValue;
  return `Lớp ${gradeNum}`;
};

// Display: {getGradeText(classItem.grade, classItem.level)}
// Kết quả: "Lớp 3"
```

---

## 🔄 Data Flow Example

### Ví dụ 1: Tạo lớp học

```
User Input: Chọn "Lớp 5"
↓
formData.level = "5" (string)
↓
handleSubmit()
↓
submitData.level = parseInt("5") = 5 (number)
↓
API POST /class { ..., level: 5 }
↓
Database: level = 5
↓
Success → Redirect to /tutor/classes
```

### Ví dụ 2: Hiển thị danh sách lớp

```
API GET /class/my-classes
↓
Response: [{ id: 1, level: 5, title: "..." }, ...]
↓
Component renders:
  classItem.level = 5 (number)
  ↓
  {getLevelText(5)}
  ↓
  return "Lớp 5"
  ↓
  Display: "Lớp 5"
```

---

## ✅ Checklist xác nhận

- [x] CreateClassPage: Dropdown 1-12, convert to int, submit
- [x] EditClassPage: Load level, dropdown 1-12, convert to int, submit
- [x] MyClassesPage: Helper function, display "Lớp X"
- [x] ClassDetailPage: Helper function, display "Lớp X"
- [x] ClassListPage: Helper function, display "Lớp X"
- [x] All conversions: parseInt() added to submitData
- [x] Build successful: npm run build

---

## 🧪 Kiểm tra nhanh

### Command:
```bash
npm start
```

### URLs cần test:
- `http://localhost:3000/tutor/classes/create` → Test dropdown
- `http://localhost:3000/tutor/classes/edit/1` → Test load & dropdown
- `http://localhost:3000/tutor/classes` → Test display "Lớp X"
- `http://localhost:3000/classes/1` → Test display "Lớp X"
- `http://localhost:3000/classes` → Test filter & display

---

## 📌 API Contract (Không thay đổi endpoint)

```javascript
// Create
POST /class
{
  subjectId: 1,
  level: 5,        // ← integer, not string
  title: "...",
  ...
}

// Update
PUT /class/123
{
  level: 5,        // ← integer, not string
  ...
}

// Get Detail
GET /class/123
Response:
{
  level: 5,        // ← integer
  ...
}

// Get My Classes
GET /class/my-classes
Response:
[
  { level: 5, ... },
  { level: 10, ... }
]

// Search
GET /class/search?grade=5&...
Response:
{
  items: [
    { level: 5, ... }
  ]
}
```

---

## 🎓 Summary

**Frontend** (này những thay đổi):
- Input: String "1"-"12"
- Process: `parseInt()` → Number 1-12
- Display: `getLevelText()` → String "Lớp 1"-"Lớp 12"
- API: Gửi & nhận Number 1-12

**Backend** (không thay đổi):
- Nhận: Number 1-12
- Lưu: Number 1-12
- Gửi: Number 1-12
