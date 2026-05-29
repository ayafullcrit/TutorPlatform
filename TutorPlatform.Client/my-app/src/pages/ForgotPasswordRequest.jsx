import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Send } from "lucide-react";

export default function ForgotPasswordRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/forgot-password/reset", { state: { email } });
  };

  return (
    <>
      <style>{`
        .font-title { font-family: 'Times New Roman', serif; }
        .font-body  { font-family: 'Times New Roman', serif; }
        .vintage-border { border: 2px solid #b59b7b; outline: 1px solid #b59b7b; outline-offset: 4px; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d4efe1] via-[#fdf6e3] to-[#f4d8e6] p-4 md:p-8 font-body text-[#5c4a3d]">
        <div className="w-full max-w-2xl bg-[#fffdf7] vintage-border rounded-[2rem] shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="font-title text-4xl md:text-5xl font-bold uppercase tracking-wide mb-2">
              Quên mật khẩu
            </h1>
            <p className="text-[#8c7355] text-2xl italic">
              Nhập email của bạn để lấy lại mật khẩu 
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#8c7355]">Email</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={15} className="text-[#a08a71]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-11 pr-4 py-4 bg-[#f6efe1] border border-[#d3c4ad] rounded-full text-3xl md:text-4xl focus:outline-none focus:border-[#a08a71] focus:ring-1 focus:ring-[#a08a71] placeholder-[#b9a88f]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#8c7355] hover:bg-[#725c42] text-[#fdfaf2] text-4xl font-title font-bold rounded-full transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Send size={17} />
              Gửi yêu cầu 
            </button>
          </form>

          <div className="mt-8 text-center text-[#8c7355] text-4xl">
            <Link
              to="/login"
              className="font-bold underline decoration-2 underline-offset-4 hover:text-[#5c4a3d] transition-colors"
            >
              Quay lại trang đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
