import { useEffect, useMemo, useState } from "react";
import { getAdminUsers, toggleUserStatus, updateAdminUser } from "../../services/userService";
import { getAvatarSrc, getInitials } from "../../utils/avatar";

const roles = ["All", "Tutor", "Student", "Admin"];

const roleLabels = {
  1: "Student",
  2: "Tutor",
  3: "Admin",
};

export default function Accounts() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const result = await getAdminUsers({ page: 1, pageSize: 200 });
      if (result.success) {
        setAccounts(result.data?.items || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const filtered = useMemo(() => {
    return accounts.filter((item) => {
      const roleName = roleLabels[item.role] || item.role || "Unknown";
      const statusName = item.isActive ? "ACTIVE" : "SUSPENDED";
      const matchRole = roleFilter === "All" || roleName === roleFilter;
      const key = `${item.id} ${item.fullName} ${item.email} ${statusName}`.toLowerCase();
      const matchQuery = key.includes(query.trim().toLowerCase());
      return matchRole && matchQuery;
    });
  }, [accounts, query, roleFilter]);

  const handleToggleStatus = async (account) => {
    await toggleUserStatus(account.id, !account.isActive);
    await loadAccounts();
    if (selectedAccount?.id === account.id) {
      setSelectedAccount((current) => current && { ...current, isActive: !current.isActive });
    }
  };

  const handleSave = async () => {
    if (!selectedAccount) return;
    setSaving(true);
    try {
      await updateAdminUser(selectedAccount.id, {
        fullName: selectedAccount.fullName,
        phoneNumber: selectedAccount.phoneNumber,
        address: selectedAccount.address,
        avatarUrl: selectedAccount.avatarUrl,
        role: selectedAccount.role,
      });
      setSelectedAccount(null);
      await loadAccounts();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Quản lý tài khoản</h2>
        <p>Quản trị người dùng, chỉnh sửa thông tin và khóa/mở tài khoản.</p>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Tìm theo tên, email hoặc mã..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {roles.map((role) => {
            const isActive = roleFilter === role;
            return (
              <button
                key={role}
                type="button"
                className={`admin-btn ${isActive ? "admin-btn--primary" : "admin-btn--secondary"}`}
                onClick={() => setRoleFilter(role)}
              >
                {role === "All" ? "Tất cả" : role}
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-card" style={{ overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--color-text-muted)" }}>
            Đang tải danh sách tài khoản...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>
                    {getAvatarSrc(item) ? (
                      <img
                        src={getAvatarSrc(item)}
                        alt={item.fullName}
                        style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#f3f0df",
                          color: "#7b5800",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        {getInitials(item.fullName, "U")}
                      </div>
                    )}
                  </td>
                  <td>{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{roleLabels[item.role] || "Unknown"}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        background: item.isActive ? "rgba(78, 160, 86, 0.12)" : "rgba(170, 86, 86, 0.12)",
                        color: item.isActive ? "#2f7a3c" : "#9e4242",
                      }}
                    >
                      {item.isActive ? "ACTIVE" : "SUSPENDED"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => setSelectedAccount({ ...item })}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => handleToggleStatus(item)}
                      >
                        {item.isActive ? "Khóa" : "Mở khóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedAccount && (
        <div className="admin-page__panel" onClick={() => setSelectedAccount(null)}>
          <div
            className="admin-card admin-page__panel-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-page__header" style={{ marginBottom: 20 }}>
              <h2>Chỉnh sửa tài khoản</h2>
              <p>Chỉnh thông tin cơ bản và quyền truy cập của người dùng.</p>
            </div>

            <div className="admin-page__stack">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {getAvatarSrc(selectedAccount) ? (
                  <img
                    src={getAvatarSrc(selectedAccount)}
                    alt={selectedAccount.fullName}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#f3f0df",
                      color: "#7b5800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {getInitials(selectedAccount.fullName, "U")}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Avatar hiện tại</div>
              </div>

              <input
                className="admin-input"
                value={selectedAccount.fullName || ""}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, fullName: e.target.value })}
                placeholder="Họ và tên"
              />
              <input
                className="admin-input"
                value={selectedAccount.email || ""}
                disabled
                placeholder="Email"
              />
              <input
                className="admin-input"
                value={selectedAccount.phoneNumber || ""}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, phoneNumber: e.target.value })}
                placeholder="Số điện thoại"
              />
              <input
                className="admin-input"
                value={selectedAccount.address || ""}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, address: e.target.value })}
                placeholder="Địa chỉ"
              />
              <input
                className="admin-input"
                value={selectedAccount.avatarUrl || ""}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, avatarUrl: e.target.value })}
                placeholder="Avatar URL"
              />
              <select
                className="admin-select"
                value={selectedAccount.role}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, role: Number(e.target.value) })}
              >
                <option value={1}>Student</option>
                <option value={2}>Tutor</option>
                <option value={3}>Admin</option>
              </select>
            </div>

            <div className="admin-page__actions">
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => setSelectedAccount(null)}
                disabled={saving}
              >
                Hủy
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
