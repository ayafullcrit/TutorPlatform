export default function SystemConfig() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-5xl font-serif">Cấu hình Hệ thống</h2>
        <p className="mt-2 text-lg text-stone-600">
          Thiết lập các thông số vận hành cốt lõi của nền tảng.
        </p>
      </div>

      <div className="bg-white p-10 rounded space-y-10">
        <div>
          <h3 className="text-2xl font-serif mb-2">Thông số Vận hành</h3>
          <p className="text-sm text-stone-500">Cấu hình tỷ lệ chiết khấu và biểu phí nền tảng.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold">
              % Phí hoa hồng nhận lớp
            </label>
          </div>
          <div className="md:col-span-2">
            <input
              type="number"
              defaultValue={15}
              className="w-full border-b-2 border-stone-300 bg-transparent outline-none py-3 text-2xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold">
              Phí đăng tin định mức
            </label>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              defaultValue="50,000"
              className="w-full border-b-2 border-stone-300 bg-transparent outline-none py-3 text-2xl"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <button className="px-5 py-3 text-[#7b5800]">Hủy bỏ</button>
          <button className="px-6 py-3 bg-[#7b5800] text-white rounded">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
}