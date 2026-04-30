export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <div>Analytics / Logs</div>

      <div className="flex items-center gap-4">
        <button className="bg-yellow-600 text-white px-4 py-2 rounded">
          New Entry
        </button>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="rounded-full"
        />
      </div>
    </div>
  );
}