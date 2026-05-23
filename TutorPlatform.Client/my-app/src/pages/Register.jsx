import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Paperclip, User, Phone, Mail, Edit3,
  Users, BookOpen, GraduationCap, Lock,
} from "lucide-react";
import { registerApi } from "../services/authService";

// Backend UserRole enum: Student=1, Tutor=2, Admin=3
export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("gia-su"); // 'gia-su' | 'hoc-vien'
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
    grade: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      // Backend UserRole: Tutor=2, Student=1
      const mappedRole = role === "gia-su" ? 2 : 1;

      const payload = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: mappedRole,
        // Chỉ gửi grade & school nếu là học viên
        grade: role === "hoc-vien" && formData.grade ? parseInt(formData.grade) : null,
        school: role === "hoc-vien" ? formData.school : null,
      };

      const result = await registerApi(payload);

      if (result.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        setError(result.message || "Đăng ký thất bại");
      }
    } catch (err) {
      const responseData = err.response?.data;
      const apiErrors = responseData?.errors;

      let normalizedErrors = "";
      if (Array.isArray(apiErrors)) {
        normalizedErrors = apiErrors.join(" | ");
      } else if (apiErrors && typeof apiErrors === "object") {
        normalizedErrors = Object.values(apiErrors)
          .flat()
          .filter(Boolean)
          .join(" | ");
      }

      const errMsg =
        normalizedErrors ||
        responseData?.message ||
        responseData?.title ||
        err.message ||
        "Đăng ký thất bại";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-title { font-family: 'Times New Roman', serif; }
        .font-body  { font-family: 'Times New Roman', serif; }
        .vintage-border { border: 2px solid #b59b7b; outline: 1px solid #b59b7b; outline-offset: 4px; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d4efe1] via-[#fdf6e3] to-[#f4d8e6] p-4 md:p-8 font-body text-[#5c4a3d]">
        <div className="relative w-full max-w-6xl bg-[#fffdf7] vintage-border rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden">

          {/* CỘT TRÁI */}
          <div className="w-full lg:w-5/12 bg-[#b0a18e] text-[#fdfaf2] p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5c4a3d_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
              <GraduationCap size={300} strokeWidth={0.5} />
            </div>

            <div className="relative z-10">
              <Paperclip size={32} className="text-[#e2d5c1] mb-8 transform -rotate-45" strokeWidth={1.5} />
              <h1 className="font-title text-4xl lg:text-5xl font-bold leading-tight mb-6 tracking-wide">
                Kiến tạo tương lai <br />
                <span className="italic font-normal">cùng giáo dục.</span>
              </h1>
              <p className="text-xl italic opacity-90 leading-relaxed border-l-2 border-[#e2d5c1] pl-4">
                Hệ thống hỗ trợ kết nối và quản lý gia sư, học viên trong một không gian học tập hiện đại.
              </p>
            </div>

            <div className="relative z-10 mt-16 lg:mt-0 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#b0a18e] bg-[#d3c4ad] flex items-center justify-center text-[#5c4a3d]"><User size={20} /></div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#b0a18e] bg-[#fdfaf2] flex items-center justify-center text-[#5c4a3d]"><GraduationCap size={20} /></div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#b0a18e] bg-[#e2d5c1] flex items-center justify-center text-[#5c4a3d] font-bold text-xs">+2k</div>
                </div>
                <p className="font-title font-bold text-sm tracking-wider uppercase opacity-90">Gia nhập cộng đồng tri thức</p>
              </div>
              <div className="flex items-center gap-2 opacity-90 text-sm font-bold tracking-wider uppercase">
                <Users size={18} />
                <span>Hơn 200 học viên tin dùng</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM */}
          <div className="w-full lg:w-7/12 p-8 lg:p-14 bg-[#fdfaf2]">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-title text-3xl lg:text-4xl font-bold text-[#5c4a3d] mb-2 uppercase tracking-wide">
                  Đăng ký tài khoản
                </h2>
                <p className="text-[#8c7355] text-xl italic">Bắt đầu hành trình của bạn ngay hôm nay.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Chọn vai trò */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Vai trò của bạn</label>
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("gia-su")}
                      className={`w-40 flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all ${
                        role === "gia-su"
                          ? "bg-[#8c7355] border-[#8c7355] text-[#fdfaf2] shadow-md -translate-y-1"
                          : "bg-transparent border-[#d3c4ad] text-[#8c7355] hover:bg-[#f6efe1]"
                      }`}
                    >
                      <BookOpen size={24} className="mb-1" strokeWidth={role === "gia-su" ? 2 : 1.5} />
                      <span className="text-sm font-bold font-title">Gia sư</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("hoc-vien")}
                      className={`w-40 flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all ${
                        role === "hoc-vien"
                          ? "bg-[#8c7355] border-[#8c7355] text-[#fdfaf2] shadow-md -translate-y-1"
                          : "bg-transparent border-[#d3c4ad] text-[#8c7355] hover:bg-[#f6efe1]"
                      }`}
                    >
                      <GraduationCap size={24} className="mb-1" strokeWidth={role === "hoc-vien" ? 2 : 1.5} />
                      <span className="text-sm font-bold font-title">Học viên</span>
                    </button>
                  </div>
                </div>

                {/* Họ tên + SĐT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Họ và tên</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-[#a08a71]" /></div>
                      <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Số điện thoại</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-[#a08a71]" /></div>
                      <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} placeholder="090 123 4567"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]" />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-[#a08a71]" /></div>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="example@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]" />
                  </div>
                </div>

                {/* Trường học + lớp (chỉ hiển thị cho học viên) */}
                {role === "hoc-vien" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Trường học</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><GraduationCap size={18} className="text-[#a08a71]" /></div>
                        <input type="text" name="school" value={formData.school} onChange={handleInputChange} placeholder="Tên trường"
                          className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Lớp (6–12)</label>
                      <select name="grade" value={formData.grade} onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all text-[#5c4a3d]">
                        <option value="">Chọn lớp</option>
                        {[6,7,8,9,10,11,12].map(g => (
                          <option key={g} value={g}>Lớp {g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Mật khẩu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Mật khẩu</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-[#a08a71]" /></div>
                      <input type="password" name="password" required value={formData.password} onChange={handleInputChange} placeholder="Tối thiểu 6 ký tự"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-[#a08a71]" /></div>
                      <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleInputChange} placeholder="Nhập lại mật khẩu"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]" />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 bg-red-100 px-4 py-2 rounded-xl text-center text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-[#8c7355] hover:bg-[#725c42] text-[#fdfaf2] text-xl font-title font-bold rounded-full transition-colors shadow-lg flex justify-center items-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Edit3 size={20} className="group-hover:rotate-12 transition-transform" />
                  {loading ? "Đang đăng ký..." : "Tạo tài khoản ngay"}
                </button>
              </form>

              <div className="mt-6 text-center text-[#8c7355] text-lg">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-bold underline decoration-2 underline-offset-4 hover:text-[#5c4a3d] transition-colors">
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
