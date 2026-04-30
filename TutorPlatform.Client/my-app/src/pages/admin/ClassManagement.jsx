export default function ClassManagement() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-5xl font-serif">Class Management</h2>
        <p className="mt-2 text-lg text-stone-600">
          Review and coordinate tutoring requests.
        </p>
      </div>

      <div className="flex gap-8 border-b relative">
        <button className="pb-3 border-b-2 border-[#7b5800] text-[#7b5800] font-semibold">
          Đang tìm gia sư
        </button>
        <button className="pb-3 text-stone-500">Đang dạy</button>
        <button className="pb-3 text-stone-500">Hoàn thành</button>
        <button className="pb-3 text-stone-500">Đã hủy</button>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-serif">Toán Đại Số Lớp 10</h3>
                <p className="text-sm uppercase tracking-widest text-stone-500 mt-1">
                  Req-0924-A1
                </p>
              </div>
              <span className="bg-slate-200 px-3 py-1 text-sm rounded">Pending</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500">Phụ Huynh / Học Viên</p>
                <p className="mt-2">Nguyễn Văn A</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500">Địa Điểm</p>
                <p className="mt-2">Quận 7, TP.HCM</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500">Yêu Cầu Gia Sư</p>
                <p className="mt-2">Sinh viên Sư Phạm Toán, Nữ</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500">Mức Lương</p>
                <p className="mt-2 text-[#7b5800] font-semibold">2.500.000đ / tháng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#e1aa36] text-[#5b4000] p-8 rounded">
            <h4 className="text-2xl font-serif mb-4">Overview</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Requests</span>
                <span className="font-serif text-2xl">42</span>
              </div>
              <div className="flex justify-between">
                <span>Unassigned</span>
                <span className="font-serif text-2xl">12</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Need</span>
                <span className="font-serif text-2xl text-red-700">3</span>
              </div>
            </div>
          </div>

          <div className="bg-[#efefd7] p-8 rounded">
            <h4 className="text-2xl font-serif mb-6">Refine Ledger</h4>
            <div className="space-y-5">
              <input className="w-full border-b bg-transparent outline-none py-2" placeholder="e.g. Mathematics" />
              <select className="w-full border-b bg-transparent outline-none py-2">
                <option>All Locations</option>
                <option>In-Person</option>
                <option>Online</option>
              </select>
              <button className="w-full border px-4 py-2 rounded">Apply Filters</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}