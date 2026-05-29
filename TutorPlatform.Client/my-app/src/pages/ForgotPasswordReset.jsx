import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KeyRound, Lock, Mail } from "lucide-react";

export default function ForgotPasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = useMemo(() => location.state?.email || "", [location.state]);

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSuccess("Xác thực OTP thành công. Bạn có thể đăng nhập với mật khẩu mới.");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <>
      <style>{`
        .font-title { font-family: 'Times New Roman', serif; }
        .font-body  { font-family: 'Times New Roman', serif; }
        .vintage-border { border: 2px solid #b59b7b; outline: 1px solid #b59b7b; outline-offset: 4px; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d4efe1] via-[#fdf6e3] to-[#f4d8e6] p-4 md:p-8 font-body text-[#5c4a3d]">
        <div className="w-full max-w-3xl bg-[#fffdf7] vintage-border rounded-[2rem] shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="font-title text-4xl md:text-5xl font-bold uppercase tracking-wide mb-2">
              Xác nhận OTP
            </h1>
            <p className="text-[#8c7355] text-2xl italic">
              Nhập OTP và mật khẩu mới để hoàn tất đổi mật khẩu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Email</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#a08a71]" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-11 pr-4 py-4 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-xl focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] placeholder-[#b9a88f]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">OTP</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound size={18} className="text-[#a08a71]" />
                </div>
                <input
                  type="text"
                  name="otp"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Mã OTP"
                  className="w-full pl-11 pr-4 py-4 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-xl focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] placeholder-[#b9a88f]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Mật khẩu mới</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#a08a71]" />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Mật khẩu mới"
                  className="w-full pl-11 pr-4 py-4 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-xl focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] placeholder-[#b9a88f]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Xác nhận mật khẩu</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#a08a71]" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full pl-11 pr-4 py-4 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-xl focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] placeholder-[#b9a88f]"
                />
              </div>
            </div>

            {error && <p className="text-red-600 bg-red-100 px-4 py-2 rounded-xl text-center text-sm">{error}</p>}
            {success && <p className="text-green-700 bg-green-100 px-4 py-2 rounded-xl text-center text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full py-4 bg-[#8c7355] hover:bg-[#725c42] text-[#fdfaf2] text-3xl font-title font-bold rounded-full transition-colors shadow-lg"
            >
              Xác nhận và cập nhật
            </button>
          </form>

          <div className="mt-8 text-center text-[#8c7355] text-3xl">
            <Link
              to="/forgot-password"
              className="font-bold underline decoration-2 underline-offset-4 hover:text-[#5c4a3d] transition-colors"
            >
              Quay lại bước nhập email
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
