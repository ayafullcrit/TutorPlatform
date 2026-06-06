import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Mail, MapPin, Phone, Star, UserCircle2, XCircle } from "lucide-react";
import { getPendingTutors, verifyTutor } from "../../services/tutorService";
import { getAvatarSrc, getInitials } from "../../utils/avatar";

const statusLabel = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

export default function Verifications() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const response = await getPendingTutors();
      if (response.success) {
        setItems(response.data || []);
        setSelectedId((current) => current ?? response.data?.[0]?.userId ?? null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const current = useMemo(
    () => items.find((item) => item.userId === selectedId) || items[0],
    [items, selectedId]
  );

  const handleApprove = async () => {
    if (!current) return;
    await verifyTutor(current.userId, 1, "");
    setRejectNote("");
    await load();
  };

  const handleReject = async () => {
    if (!current) return;
    await verifyTutor(current.userId, 2, rejectNote.trim());
    setRejectNote("");
    await load();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-5xl font-serif text-[#1b1d0e]">Xác Minh Gia Sư</h2>
        <p className="mt-2 text-stone-600">
          Xem hồ sơ chờ duyệt, đọc thông tin chi tiết và phê duyệt hoặc từ chối trực tiếp.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded p-10 text-center">Đang tải danh sách gia sư...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded p-10 text-center text-stone-500">
          Không có gia sư nào đang chờ xác minh.
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif">Danh Sách Chờ Duyệt</h3>
              <span className="text-xs uppercase tracking-widest text-stone-500">{items.length} hồ sơ</span>
            </div>

            <div className="space-y-3 max-h-[72vh] overflow-auto pr-1">
              {items.map((tutor) => {
                const active = tutor.userId === current?.userId;
                return (
                  <button
                    key={tutor.userId}
                    onClick={() => {
                      setSelectedId(tutor.userId);
                      setRejectNote("");
                    }}
                    className={`w-full text-left rounded border p-4 transition ${
                      active ? "border-[#7b5800] bg-[#f7f1dc]" : "border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getAvatarSrc(tutor) ? (
                        <img
                          src={getAvatarSrc(tutor)}
                          alt={tutor.fullName}
                          className="w-12 h-12 rounded-full object-cover bg-stone-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold">
                          {getInitials(tutor.fullName, "T")}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{tutor.fullName}</div>
                        <div className="text-sm text-stone-500 truncate">ID: {tutor.userId}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-stone-100 text-stone-700">
                        ₫{Number(tutor.hourlyRate || 0).toLocaleString("vi-VN")}/h
                      </span>
                      <span className="px-2 py-1 rounded bg-stone-100 text-stone-700">
                        {tutor.totalReviews || 0} reviews
                      </span>
                      <span className="px-2 py-1 rounded bg-amber-100 text-amber-700">
                        {statusLabel[tutor.verificationStatus] || "Pending"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded p-8">
            {current && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getAvatarSrc(current) ? (
                      <img
                        src={getAvatarSrc(current)}
                        alt={current.fullName}
                        className="w-20 h-20 rounded-full object-cover bg-stone-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xl">
                        {getInitials(current.fullName, "T")}
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-serif text-[#1b1d0e]">{current.fullName}</h3>
                      <p className="text-stone-500">Tutor ID: {current.userId}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded text-xs bg-[#efefd7] text-[#5b4000]">
                          {statusLabel[current.verificationStatus] || "Pending"}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-stone-100 text-stone-700">
                          {current.isActive ? "Active" : "Blocked"}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-stone-100 text-stone-700">
                          Role: {current.role === 2 ? "Tutor" : current.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReject}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded border border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle size={18} />
                      Từ chối
                    </button>
                    <button
                      onClick={handleApprove}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#7b5800] text-white hover:bg-[#5b4100]"
                    >
                      <CheckCircle2 size={18} />
                      Chấp nhận
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <InfoCard icon={<Mail size={16} />} label="Email" value={current.email || "N/A"} />
                  <InfoCard icon={<Phone size={16} />} label="Số điện thoại" value={current.phoneNumber || "N/A"} />
                  <InfoCard icon={<MapPin size={16} />} label="Địa chỉ" value={current.address || "N/A"} />
                  <InfoCard icon={<Star size={16} />} label="Đánh giá" value={`${current.rating || 0} ⭐ (${current.totalReviews || 0} reviews)`} />
                  <InfoCard icon={<Clock3 size={16} />} label="Phí giờ" value={`₫${Number(current.hourlyRate || 0).toLocaleString("vi-VN")}/h`} />
                  <InfoCard icon={<UserCircle2 size={16} />} label="Số dư" value={`₫${Number(current.balance || 0).toLocaleString("vi-VN")}`} />
                </div>

                <div className="rounded bg-[#f9f7ef] p-5">
                  <div className="text-xs uppercase tracking-widest text-stone-500">Ghi chú xác minh</div>
                  <p className="mt-2 text-stone-700">
                    {current.verificationNote || "Chưa có ghi chú từ hệ thống hoặc admin trước đó."}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest font-semibold text-stone-500">
                    Ghi chú khi từ chối
                  </label>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Nêu rõ lý do từ chối để gia sư chỉnh sửa hồ sơ."
                    className="w-full min-h-28 rounded border border-stone-300 px-4 py-3 outline-none focus:border-[#7b5800]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded border border-stone-200 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-lg text-[#1b1d0e]">{value}</div>
    </div>
  );
}
