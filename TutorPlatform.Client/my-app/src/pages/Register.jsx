import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Paperclip,
  User,
  Calendar,
  Phone,
  Mail,
  Edit3,
  Users,
  BookOpen,
  GraduationCap,
  Lock,
} from "lucide-react";
import { registerApi } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("gia-su"); // 'gia-su' or 'hoc-vien'
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
      // Map frontend role to backend enum (Student=1, Tutor=2)
      const mappedRole = role === "gia-su" ? 2 : 1;
      
      const payload = {
        ...formData,
        role: mappedRole,
        grade: formData.grade ? parseInt(formData.grade) : null,
      };

      const result = await registerApi(payload);

      if (result.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        setError(result.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Register error:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0] || "Đăng ký thất bại";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

          .font-title {
            font-family: 'Times New Roman', serif;
          }

          .font-body {
            font-family: 'Times New Roman', serif;
          }

          .vintage-border {
            border: 2px solid #b59b7b;
            outline: 1px solid #b59b7b;
            outline-offset: 4px;
          }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d4efe1] via-[#fdf6e3] to-[#f4d8e6] p-4 md:p-8 font-body text-[#5c4a3d]">
        <div className="relative w-full max-w-6xl bg-[#fffdf7] vintage-border rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
          {/* Cột trái */}
          <div className="w-full lg:w-5/12 bg-[#b0a18e] text-[#fdfaf2] p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5c4a3d_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
              <GraduationCap size={300} strokeWidth={0.5} />
            </div>

            <div className="relative z-10">
              <Paperclip
                size={32}
                className="text-[#e2d5c1] mb-8 transform -rotate-45"
                strokeWidth={1.5}
              />
              <h1 className="font-title text-4xl lg:text-5xl font-bold leading-tight mb-6 tracking-wide">
                Kiến tạo tương lai <br />
                <span className="italic font-normal">cùng giáo dục.</span>
              </h1>
              <p className="text-xl italic opacity-90 leading-relaxed border-l-2 border-[#e2d5c1] pl-4">
                Hệ thống hỗ trợ kết nối và quản lý gia sư, học viên và đội ngũ
                quản lý trong một không gian học tập hiện đại.
              </p>
            </div>

            <div className="relative z-10 mt-16 lg:mt-0 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#b0a18e] bg-[#d3c4ad] flex items-center justify-center text-[#5c4a3d]">
                    <User size={20} />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#b0a18e] bg-[#fdfaf2] flex items-center justify-center text-[#5c4a3d]">
                    <GraduationCap size={20} />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#b0a18e] bg-[#e2d5c1] flex items-center justify-center text-[#5c4a3d] font-bold text-xs">
                    +2k
                  </div>
                </div>
                <p className="font-title font-bold text-sm tracking-wider uppercase opacity-90">
                  Gia nhập cộng đồng tri thức
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-90 text-sm font-bold tracking-wider uppercase">
                <Users size={18} />
                <span>Hơn 200 học viên tin dùng</span>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="w-full lg:w-7/12 p-8 lg:p-14 bg-[#fdfaf2]">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-title text-3xl lg:text-4xl font-bold text-[#5c4a3d] mb-2 uppercase tracking-wide">
                  Đăng ký tài khoản
                </h2>
                <p className="text-[#8c7355] text-xl italic">
                  Bắt đầu hành trình của bạn ngay hôm nay.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Role */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">
                    Vai trò của bạn
                  </label>

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
                      <BookOpen
                        size={24}
                        className="mb-1"
                        strokeWidth={role === "gia-su" ? 2 : 1.5}
                      />
                      <span className="text-sm font-bold font-title">
                        Gia sư
                      </span>
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
                      <GraduationCap
                        size={24}
                        className="mb-1"
                        strokeWidth={role === "hoc-vien" ? 2 : 1.5}
                      />
                      <span className="text-sm font-bold font-title">
                        Học viên
                      </span>
                    </button>
                  </div>
                </div>

                {/* Họ tên + tuổi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-[#a08a71]" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-[#a08a71]" />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="090 123 4567"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-[#a08a71]" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@tutorflow.com"
                      className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-[#a08a71]" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-[#a08a71]" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full pl-11 pr-4 py-3 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-lg focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] transition-all placeholder-[#c2b29e]"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 bg-red-100 px-4 py-2 rounded-xl text-center text-sm">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-[#8c7355] hover:bg-[#725c42] text-[#fdfaf2] text-xl font-title font-bold rounded-full transition-colors shadow-lg flex justify-center items-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Edit3
                    size={20}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  {loading ? 'Đang đăng ký...' : 'Tạo tài khoản ngay'}
                </button>
              </form>

              {/* Link về login */}
              <div className="mt-6 text-center text-[#8c7355] text-lg">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-bold underline decoration-2 underline-offset-4 hover:text-[#5c4a3d] transition-colors"
                >
                  Đăng nhập
                </Link>
              </div>

              {/* Divider */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-px bg-[#d3c4ad] flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#a08a71]">
                  Hoặc kết nối qua
                </span>
                <div className="h-px bg-[#d3c4ad] flex-1"></div>
              </div>

              {/* Social */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#d3c4ad] rounded-full hover:bg-[#f6efe1] transition-colors font-title font-bold text-[#5c4a3d] text-sm tracking-wide"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  GOOGLE
                </button>

                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#d3c4ad] rounded-full hover:bg-[#f6efe1] transition-colors font-title font-bold text-[#5c4a3d] text-sm tracking-wide"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.365 21.41c-.45.3-.92.59-1.42.74-.5.15-1.02.22-1.57.22s-1.08-.07-1.58-.22c-.5-.15-.98-.44-1.42-.74-1.12-.76-2.26-1.52-3.41-1.52-1.14 0-2.28.76-3.41 1.52-.44.3-.92.59-1.42.74-.5.15-1.02.22-1.58.22s-1.08-.07-1.57-.22c-.5-.15-.97-.44-1.42-.74C1.3 19.8 0 17.5 0 14.5c0-1.8.44-3.47 1.32-5.01.88-1.54 2.15-2.66 3.8-3.36.46-.2 1.04-.3 1.74-.3.73 0 1.48.16 2.24.48.76.32 1.46.7 2.1 1.15.65-.45 1.35-.83 2.1-1.15.76-.32 1.5-.48 2.23-.48.7 0 1.28.1 1.74.3 1.65.7 2.92 1.82 3.8 3.36.88 1.54 1.32 3.2 1.32 5.01 0 3-1.3 5.3-3.03 6.91zm-4.38-16.1c-.2.58-.53 1.12-.99 1.62-.46.5-.98.9-1.56 1.2-.58.3-1.2.45-1.86.45-.06 0-.13-.01-.2-.02-.02-.63.15-1.25.5-1.87.35-.62.83-1.16 1.44-1.62.6-.46 1.26-.78 1.98-.96.72-.18 1.4-.2 2.05-.06-.02.43-.13.85-.36 1.26z" />
                  </svg>
                  APPLE
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-[#8c7355] leading-relaxed max-w-sm mx-auto uppercase tracking-wide">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <button
                  type="button"
                  className="font-bold underline hover:text-[#5c4a3d] bg-none border-none cursor-pointer p-0"
                >
                  Điều khoản dịch vụ
                </button>{" "}
                và{" "}
                <button
                  type="button"
                  className="font-bold underline hover:text-[#5c4a3d] bg-none border-none cursor-pointer p-0"
                >
                  Chính sách bảo mật
                </button>{" "}
                của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}