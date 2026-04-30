// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function LoginSplit() {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     alert(`Đăng nhập với tài khoản: ${formData.username}`);
//   };

//   return (
//     <>
//       {/* Import Font chữ cổ điển từ Google Fonts */}
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          
//           .font-title {
//             font-family: 'Playfair Display', serif;
//           }
          
//           .font-body {
//             font-family: 'Cormorant Garamond', serif;
//           }
//         `}
//       </style>

//       {/* Vùng nền background chính (Pastel gradient) */}
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d4efe1] via-[#fdf6e3] to-[#f4d8e6] p-4 font-body">
        
//         {/* Container chính: Bo góc lớn, đổ bóng, chia 2 cột */}
//         <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#e2d5c1]">
          
//           {/* CỘT TRÁI: FORM ĐĂNG NHẬP (Màu nền rêu/nâu vintage) */}
//           <div className="w-full md:w-1/2 bg-[#b0a18e] p-10 md:p-14 flex flex-col justify-center relative">
            
//             {/* Lớp phủ hoa văn mờ (tùy chọn để tăng tính vintage) */}
//             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5c4a3d_1px,transparent_1px)] [background-size:16px_16px]"></div>

//             <div className="relative z-10 w-full max-w-sm mx-auto">
//               <h2 className="font-title text-4xl text-[#fdfaf2] font-bold text-center mb-8 tracking-wide">
//                 Đăng nhập
//               </h2>

//               <form onSubmit={handleLogin} className="space-y-6">
//                 {/* Tên đăng nhập */}
//                 <div>
//                   <input
//                     type="text"
//                     name="username"
//                     required
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     placeholder="Tên đăng nhập / Email"
//                     className="w-full px-6 py-4 bg-[#fdfaf2] border-none rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[#8c7355] transition-all placeholder-[#a08a71] text-[#5c4a3d] font-semibold"
//                   />
//                 </div>

//                 {/* Mật khẩu */}
//                 <div>
//                   <input
//                     type="password"
//                     name="password"
//                     required
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="Mật khẩu"
//                     className="w-full px-6 py-4 bg-[#fdfaf2] border-none rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[#8c7355] transition-all placeholder-[#a08a71] text-[#5c4a3d] font-semibold"
//                   />
//                 </div>

//                 {/* Quên mật khẩu */}
//                 <div className="text-right">
//                   <a href="#" className="text-[#fdfaf2] text-sm md:text-base hover:text-[#e2d5c1] italic transition-colors">
//                     Quên mật khẩu?
//                   </a>
//                 </div>

//                 {/* Nút Log in */}
//                 <button
//                   type="submit"
//                   className="w-full py-4 bg-[#8c7355] hover:bg-[#725c42] text-[#fdfaf2] text-xl font-title font-bold rounded-full transition-transform transform hover:-translate-y-1 shadow-lg mt-2"
//                 >
//                   ĐĂNG NHẬP
//                 </button>
//               </form>

//               {/* Chuyển sang Đăng ký */}
//               <div className="mt-8 text-center text-[#fdfaf2] text-lg">
//                 Chưa có tài khoản?{' '}
//                 <Link
//                 to="/register"
//                 className="font-bold underline decoration-2 underline-offset-4 hover:text-[#e2d5c1] transition-colors"
//                 >
//                 Đăng ký
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* CỘT PHẢI: LỜI CHÀO & ĐỒ HỌA (Nền kem sáng) */}
//           <div className="w-full md:w-1/2 bg-[#fffdf7] p-10 md:p-14 flex flex-col justify-center items-center relative overflow-hidden hidden md:flex">
            
//             {/* Các khối tròn trang trí lơ lửng (Mô phỏng hình ảnh mẫu bằng CSS) */}
            
//             {/* Cụm trên cùng phải */}
//             <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-gradient-to-br from-[#f4d8e6] to-[#e2c6d5] opacity-80 blur-[2px]"></div>
//             <div className="absolute top-[15%] right-[25%] w-16 h-16 rounded-full bg-[#d4efe1] shadow-md"></div>
//             <div className="absolute top-[8%] left-[20%] w-8 h-8 rounded-full bg-[#e2d5c1]"></div>

//             {/* Cụm giữa */}
//             <div className="absolute top-[40%] left-[-10%] w-32 h-32 rounded-full border-[12px] border-[#f4d8e6] opacity-60"></div>
//             <div className="absolute top-[60%] right-[10%] w-12 h-12 rounded-full bg-[#b0a18e] shadow-inner"></div>

//             {/* Cụm dưới cùng */}
//             <div className="absolute bottom-[-15%] left-[10%] w-48 h-48 rounded-full border-[20px] border-[#d4efe1] opacity-70"></div>
//             <div className="absolute bottom-[20%] left-[30%] w-6 h-6 rounded-full bg-[#8c7355]"></div>
//             <div className="absolute bottom-[5%] right-[5%] w-24 h-24 rounded-full bg-gradient-to-tl from-[#e2d5c1] to-[#fdf6e3] shadow-lg"></div>

//             {/* Nội dung Text */}
//             <div className="relative z-10 text-center mt-12">
//               <h1 className="font-title text-5xl lg:text-6xl font-bold text-[#5c4a3d] mb-4 tracking-wider uppercase">
//                 CHÀO MỪNG !
//               </h1>
//               <p className="text-xl text-[#8c7355] italic">
//                 Hệ thống Quản lý Gia sư & Học viên <br/>
//                 Đăng nhập để tiếp tục
//               </p>
//             </div>

//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../services/authService';

export default function LoginSplit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'tutor') {
        navigate('/tutor/dashboard');
      } else if (data.user.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
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
            font-family: 'Playfair Display', serif;
          }
          
          .font-body {
            font-family: 'Cormorant Garamond', serif;
          }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d4efe1] via-[#fdf6e3] to-[#f4d8e6] p-4 font-body">
        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#e2d5c1]">
          
          <div className="w-full md:w-1/2 bg-[#b0a18e] p-10 md:p-14 flex flex-col justify-center relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5c4a3d_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 w-full max-w-sm mx-auto">
              <h2 className="font-title text-4xl text-[#fdfaf2] font-bold text-center mb-8 tracking-wide">
                Đăng nhập
              </h2>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Tên đăng nhập / Email"
                    className="w-full px-6 py-4 bg-[#fdfaf2] border-none rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[#8c7355] transition-all placeholder-[#a08a71] text-[#5c4a3d] font-semibold"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mật khẩu"
                    className="w-full px-6 py-4 bg-[#fdfaf2] border-none rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[#8c7355] transition-all placeholder-[#a08a71] text-[#5c4a3d] font-semibold"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-[#fdfaf2] text-sm md:text-base hover:text-[#e2d5c1] italic transition-colors bg-none border-none cursor-pointer p-0"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {error && (
                  <p className="text-red-100 bg-red-500/30 px-4 py-2 rounded-xl text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#8c7355] hover:bg-[#725c42] text-[#fdfaf2] text-xl font-title font-bold rounded-full transition-transform transform hover:-translate-y-1 shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                </button>
              </form>

              <div className="mt-8 text-center text-[#fdfaf2] text-lg">
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="font-bold underline decoration-2 underline-offset-4 hover:text-[#e2d5c1] transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-[#fffdf7] p-10 md:p-14 flex flex-col justify-center items-center relative overflow-hidden hidden md:flex">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-gradient-to-br from-[#f4d8e6] to-[#e2c6d5] opacity-80 blur-[2px]"></div>
            <div className="absolute top-[15%] right-[25%] w-16 h-16 rounded-full bg-[#d4efe1] shadow-md"></div>
            <div className="absolute top-[8%] left-[20%] w-8 h-8 rounded-full bg-[#e2d5c1]"></div>

            <div className="absolute top-[40%] left-[-10%] w-32 h-32 rounded-full border-[12px] border-[#f4d8e6] opacity-60"></div>
            <div className="absolute top-[60%] right-[10%] w-12 h-12 rounded-full bg-[#b0a18e] shadow-inner"></div>

            <div className="absolute bottom-[-15%] left-[10%] w-48 h-48 rounded-full border-[20px] border-[#d4efe1] opacity-70"></div>
            <div className="absolute bottom-[20%] left-[30%] w-6 h-6 rounded-full bg-[#8c7355]"></div>
            <div className="absolute bottom-[5%] right-[5%] w-24 h-24 rounded-full bg-gradient-to-tl from-[#e2d5c1] to-[#fdf6e3] shadow-lg"></div>

            <div className="relative z-10 text-center mt-12">
              <h1 className="font-title text-5xl lg:text-6xl font-bold text-[#5c4a3d] mb-4 tracking-wider uppercase">
                CHÀO MỪNG !
              </h1>
              <p className="text-xl text-[#8c7355] italic">
                Hệ thống Quản lý Gia sư & Học viên <br />
                Đăng nhập để tiếp tục
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}