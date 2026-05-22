import { useState, useEffect } from "react";
import { searchClasses, deleteClass } from "../../services/classService";

const CLASS_STATUS_TEXT = { 
  1: "Nháp", 
  2: "Đang học", 
  3: "Hoàn thành", 
  4: "Đã hủy", 
  5: "Không hoạt động" 
};

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      // searchClasses returns ApiResponse<PaginatedResponse<ClassResponse>>
      const result = await searchClasses({ pageSize: 100 }); 
      if (result?.success && result.data?.items) {
        setClasses(result.data.items);
      }
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lớp học này?")) return;
    try {
      await deleteClass(id);
      setClasses(classes.filter(c => c.id !== id));
      setSelectedClass(null);
    } catch (error) {
      alert("Lỗi khi xóa lớp học");
    }
  };

  const filteredClasses = classes.filter(c => {
    const matchStatus = statusFilter === "all" || c.status === parseInt(statusFilter);
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      c.tutorName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-5xl font-serif">Quản lý Lớp học</h2>
        <p className="mt-2 text-lg text-stone-600">
          Xem và điều phối các lớp học trên toàn hệ thống.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between border-b pb-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          <button 
            className={`pb-2 whitespace-nowrap ${statusFilter === "all" ? "border-b-2 border-[#7b5800] text-[#7b5800] font-semibold" : "text-stone-500"}`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          <button 
            className={`pb-2 whitespace-nowrap ${statusFilter === "2" ? "border-b-2 border-[#7b5800] text-[#7b5800] font-semibold" : "text-stone-500"}`}
            onClick={() => setStatusFilter("2")}
          >
            Đang học
          </button>
          <button 
            className={`pb-2 whitespace-nowrap ${statusFilter === "1" ? "border-b-2 border-[#7b5800] text-[#7b5800] font-semibold" : "text-stone-500"}`}
            onClick={() => setStatusFilter("1")}
          >
            Chờ duyệt/Nháp
          </button>
          <button 
            className={`pb-2 whitespace-nowrap ${statusFilter === "3" ? "border-b-2 border-[#7b5800] text-[#7b5800] font-semibold" : "text-stone-500"}`}
            onClick={() => setStatusFilter("3")}
          >
            Hoàn thành
          </button>
        </div>

        <input 
          className="bg-[#efefd7] px-4 py-2 rounded outline-none w-full md:max-w-xs"
          placeholder="Tìm theo tiêu đề, gia sư..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20">Đang tải danh sách lớp học...</div>
      ) : (
        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((c) => (
                <div key={c.id} className="bg-white p-8 rounded shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-serif">{c.title}</h3>
                      <p className="text-sm uppercase tracking-widest text-stone-500 mt-1">
                        ID: CLASS-{c.id} · Lớp {c.gradeLevel}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded ${
                      c.status === 2 ? "bg-green-100 text-green-700" : "bg-stone-200"
                    }`}>
                      {CLASS_STATUS_TEXT[c.status] || "N/A"}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-stone-500">Gia sư</p>
                      <p className="mt-2 font-medium">{c.tutorName || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-stone-500">Môn học</p>
                      <p className="mt-2">{c.subjectName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-stone-500">Học viên</p>
                      <p className="mt-2">{c.currentStudents} / {c.maxStudents}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-stone-500">Học phí/buổi</p>
                      <p className="mt-2 text-[#7b5800] font-semibold">
                        ₫{c.pricePerSession?.toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                    <button 
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleDelete(c.id)}
                    >
                      Xóa lớp
                    </button>
                    <button 
                      className="px-4 py-2 bg-[#7b5800] text-white rounded"
                      onClick={() => setSelectedClass(c)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-20 rounded text-center text-stone-400">
                Không tìm thấy lớp học nào.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-[#e1aa36] text-[#5b4000] p-8 rounded">
              <h4 className="text-2xl font-serif mb-4">Tổng quan</h4>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-[#5b4000]/10 pb-2">
                  <span>Tổng số lớp</span>
                  <span className="font-serif text-2xl">{classes.length}</span>
                </div>
                <div className="flex justify-between border-b border-[#5b4000]/10 pb-2">
                  <span>Đang hoạt động</span>
                  <span className="font-serif text-2xl">
                    {classes.filter(c => c.status === 2).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cần xử lý</span>
                  <span className="font-serif text-2xl text-red-700">
                    {classes.filter(c => c.status === 1).length}
                  </span>
                </div>
              </div>
            </div>

            {selectedClass && (
              <div className="bg-[#efefd7] p-8 rounded">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-serif">Chi tiết lớp</h4>
                  <button onClick={() => setSelectedClass(null)} className="text-stone-500">×</button>
                </div>
                <div className="space-y-4 text-sm">
                  <p><strong>Mô tả:</strong> {selectedClass.description || "Không có mô tả"}</p>
                  <p><strong>Thời lượng:</strong> {selectedClass.durationMinutes} phút/buổi</p>
                  <p><strong>Số buổi:</strong> {selectedClass.totalSessions}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}