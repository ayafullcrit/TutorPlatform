import { useState, useEffect } from "react";
import { getPendingTutors, verifyTutor } from "../../services/tutorService";

export default function Verifications() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadPendingTutors();
  }, []);

  const loadPendingTutors = async () => {
    try {
      setLoading(true);
      const result = await getPendingTutors();
      if (result.success) {
        setTutors(result.data);
      }
    } catch (error) {
      console.error("Failed to load pending tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      const result = await verifyTutor(id);
      if (result.success) {
        alert("Xác thực gia sư thành công!");
        loadPendingTutors();
        setCurrentIndex(0);
      }
    } catch (error) {
      alert("Lỗi khi xác thực gia sư");
    }
  };

  const current = tutors[currentIndex];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-5xl font-serif">Pending Verifications</h2>
        <p className="mt-2 text-stone-600">Review and authorize incoming tutor profiles.</p>
      </div>

      {loading ? (
        <div className="text-center py-20">Đang tải danh sách chờ...</div>
      ) : tutors.length === 0 ? (
        <div className="bg-white p-10 rounded text-center text-stone-500">
          Không có yêu cầu xác thực nào đang chờ.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-4">
            {tutors.map((t, i) => (
              <div
                key={t.userId}
                onClick={() => setCurrentIndex(i)}
                className={`p-5 rounded border-l-4 cursor-pointer transition-all ${
                  i === currentIndex ? "bg-[#efefd7] border-[#7b5800]" : "bg-white border-transparent hover:bg-stone-50"
                }`}
              >
                <h4 className="font-serif text-xl">{t.fullName}</h4>
                <p className="text-sm text-stone-600">ID: {t.userId}</p>
                <p className="text-xs text-stone-500 mt-2">Hourly Rate: ₫{t.hourlyRate.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="lg:w-2/3 bg-white p-8 rounded">
            {current && (
              <>
                <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
                  <div>
                    <h3 className="text-3xl font-serif">{current.fullName}</h3>
                    <p className="text-stone-500">Tutor User ID: {current.userId}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-5 py-2 bg-red-100 text-red-700 rounded">Từ chối</button>
                    <button 
                      onClick={() => handleVerify(current.userId)}
                      className="px-5 py-2 bg-[#7b5800] text-white rounded hover:bg-[#5b4100]"
                    >
                      Chấp nhận
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-10">
                  <div className="col-span-2">
                    <p className="text-xs uppercase tracking-widest text-stone-500">Bio / Introduction</p>
                    <p className="mt-2 text-lg">{current.bio || "No bio provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-stone-500">Hourly Rate</p>
                    <p className="mt-2 text-lg">₫{current.hourlyRate.toLocaleString()}/h</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-stone-500">Rating</p>
                    <p className="mt-2 text-lg">{current.rating} ⭐ ({current.totalReviews} reviews)</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}