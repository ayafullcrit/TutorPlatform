const tutors = [
  { id: 1, name: "Nguyen Van A", subject: "Mathematics, Physics", date: "Oct 24, 2023" },
  { id: 2, name: "Tran Thi B", subject: "English Literature", date: "Oct 23, 2023" },
  { id: 3, name: "Le Minh C", subject: "Chemistry", date: "Oct 22, 2023" },
];

export default function Verifications() {
  const current = tutors[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-5xl font-serif">Pending Verifications</h2>
        <p className="mt-2 text-stone-600">Review and authorize incoming tutor profiles.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-4">
          {tutors.map((t, i) => (
            <div
              key={t.id}
              className={`p-5 rounded border-l-4 ${
                i === 0 ? "bg-[#efefd7] border-[#7b5800]" : "bg-white border-transparent"
              }`}
            >
              <h4 className="font-serif text-xl">{t.name}</h4>
              <p className="text-sm text-stone-600">{t.subject}</p>
              <p className="text-xs text-stone-500 mt-2">Submitted: {t.date}</p>
            </div>
          ))}
        </div>

        <div className="lg:w-2/3 bg-white p-8 rounded">
          <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
            <div>
              <h3 className="text-3xl font-serif">{current.name}</h3>
              <p className="text-stone-500">ID: TUT-8492-B</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-red-100 text-red-700 rounded">Từ chối</button>
              <button className="px-5 py-2 bg-[#7b5800] text-white rounded">Chấp nhận</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500">Subject Expertise</p>
              <p className="mt-2 text-lg">Mathematics, Physics</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500">Education Level</p>
              <p className="mt-2 text-lg">M.Sc. Applied Mathematics</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500">Experience</p>
              <p className="mt-2 text-lg">4 Years</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}