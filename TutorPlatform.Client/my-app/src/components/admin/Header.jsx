import { getCurrentUser } from "../../services/authService";
import { getAvatarSrc, getInitials, getUserFullName } from "../../utils/avatar";

export default function Header() {
  const user = getCurrentUser();
  const fullName = getUserFullName(user, "Admin");
  const avatarSrc = getAvatarSrc(user);

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <div>Analytics / Logs</div>

      <div className="flex items-center gap-4">
        <button className="bg-yellow-600 text-white px-4 py-2 rounded">
          New Entry
        </button>
        {avatarSrc ? (
          <img src={avatarSrc} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#7b5800] text-white flex items-center justify-center font-bold text-sm">
            {getInitials(fullName, "AD")}
          </div>
        )}
      </div>
    </div>
  );
}
