export default function Topbar() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-[#fbfbe2] border-b border-stone-200/30 sticky top-0 z-10">
      <nav className="hidden md:flex gap-6 text-sm text-stone-500">
        <a href="/">Analytics</a>
        <a href="/">Audits</a>
        <a href="/">Logs</a>
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        <button className="bg-[#7b5800] text-white px-4 py-2 rounded hover:opacity-90">
          New Entry
        </button>
        <button className="text-stone-500">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-stone-500">
          <span className="material-symbols-outlined">history</span>
        </button>
        <div className="w-9 h-9 rounded-full bg-stone-300" />
      </div>
    </header>
  );
}