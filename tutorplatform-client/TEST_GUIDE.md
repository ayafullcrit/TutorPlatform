# 🧪 Hướng dẫn kiểm tra chức năng Level (Cấp lớp)

## ✅ Danh sách file đã sửa

1. ✅ `src/pages/CreateClassPage.jsx`
2. ✅ `src/pages/EditClassPage.jsx` 
3. ✅ `src/pages/MyClassesPage.jsx`
4. ✅ `src/pages/ClassDetailPage.jsx`
5. ✅ `src/pages/ClassListPage.jsx`

---

## 🔍 Các phần cần kiểm tra

### 1️⃣ **Trang tạo lớp học** (`/tutor/classes/create`)
```
Kiểm tra:
- [ ] Dropdown "Cấp lớp" có các option: Lớp 1, Lớp 2, ..., Lớp 12
- [ ] Default value là "Lớp 1" (value='1')
- [ ] Khi submit form, level được convert thành số nguyên (1-12)
- [ ] API nhận được: { level: 1 } (kiểu number, không string)
```

### 2️⃣ **Trang chỉnh sửa lớp học** (`/tutor/classes/edit/:id`)
```
Kiểm tra:
- [ ] Load dữ liệu lớp: level được hiển thị đúng trong dropdown
  VD: Nếu API trả về level: 5 → dropdown hiển thị "Lớp 5"
- [ ] Dropdown có các option: Lớp 1-12
- [ ] Khi submit, level được convert thành số nguyên
- [ ] API nhận được: { level: 5 } (kiểu number)
```

### 3️⃣ **Trang danh sách lớp của tôi** (`/tutor/classes`)
```
Kiểm tra:
- [ ] Bảng hiển thị cột "Lớp học" với level dạng "Lớp X"
  VD: classItem.level = 1 → hiển thị "Lớp 1"
- [ ] Tất cả lớp hiển thị đúng cấp lớp
```

### 4️⃣ **Trang chi tiết lớp học** (`/classes/:id`)
```
Kiểm tra:
- [ ] Badge cấp lớp hiển thị: "Lớp X"
  VD: classData.level = 3 → "Lớp 3"
- [ ] Hình ảnh, môn học, giá cả khác không bị ảnh hưởng
```

### 5️⃣ **Trang danh sách lớp công khai** (`/classes`)
```
Kiểm tra:
- [ ] Filter "Khối lớp" có options: Lớp 1-12
- [ ] Card lớp học hiển thị "Lớp X"
  VD: classItem.level = 10 → "Lớp 10"
- [ ] Filter theo cấp lớp hoạt động đúng
```

---

## 📊 Test Cases

### Test Case 1: Tạo lớp mới
```
Steps:
1. Navigate to /tutor/classes/create
2. Fill form:
   - Subject: Toán
   - Level: Lớp 5
   - Title: Toán lớp 5 - Số thập phân
   - Description: ...
   - Price: 150000
   - Duration: 90
   - Students: 10
3. Click "Tạo lớp học"

Expected:
- API POST /class nhận: { level: 5, ... }
- Success message: "✅ Tạo lớp học thành công!"
- Redirect to /tutor/classes
```

### Test Case 2: Chỉnh sửa lớp
```
Steps:
1. Navigate to /tutor/classes/edit/123 (class có level=7)
2. Form load:
   - Level dropdown hiển thị "Lớp 7" (selected)
3. Change level to "Lớp 10"
4. Click "Lưu thay đổi"

Expected:
- API PUT /class/123 nhận: { level: 10, ... }
- Success message: "✅ Cập nhật lớp học thành công!"
```

### Test Case 3: Xem chi tiết lớp
```
Steps:
1. Navigate to /classes/456 (class có level=9)

Expected:
- Badge cấp lớp hiển thị: "Lớp 9"
- Không có lỗi JavaScript
```

### Test Case 4: Filter theo cấp lớp
```
Steps:
1. Navigate to /classes
2. Select filter "Khối lớp" = "Lớp 12"
3. Click "Tìm kiếm"

Expected:
- API query param: { grade: 12 }
- Cards hiển thị: chỉ lớp 12
- Mỗi card hiển thị: "Lớp 12"
```

---

## 🔧 Data Flow

```
Frontend → API → Database
   ↓
'1' (string) → parseInt('1') = 1 (number)
   ↓
{ level: 1 }
   ↓
[API Endpoint]
   ↓
{ level: 1 } ← stored in DB
   ↓
Fetch: { level: 1 }
   ↓
getLevelText(1) = "Lớp 1"
   ↓
Display: "Lớp 1"
```

---

## ⚠️ Có thể gặp vấn đề

1. **Level hiển thị là số (1, 2, 3)**
   - Kiểm tra: Có gọi `getLevelText()` không?
   - Fix: Thêm helper function nếu chưa có

2. **API nhận level là string ('1', '2')**
   - Kiểm tra: Có `parseInt()` trong submitData?
   - Fix: Thêm `level: parseInt(formData.level)`

3. **Dropdown không hiển thị giá trị đã lưu**
   - Kiểm tra: `formData.level` có update từ API không?
   - Fix: Đảm bảo `setFormData` gán đúng `level` từ response

4. **Build warning "unused variable"**
   - ✅ Đã fix bằng cách sử dụng `getLevelText()` trong JSX

---

## 🚀 Xác nhận hoàn thành

```bash
# Build check
npm run build
# Expected: Compiled with warnings (ESLint warnings only)
# ✅ No error about level, parseInt, getLevelText

# Start dev server
npm start
# Navigate through pages and test as per test cases above
```
