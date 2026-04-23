import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../api/paymentApi';
import './WalletPage.css';

const TOP_UP_PRESETS = [50000, 100000, 200000, 500000, 1000000, 2000000];

const PAYMENT_METHODS = [
  { id: 'Mock',  label: 'Thẻ nội địa (Test)',  icon: '💳' },
  { id: 'VNPay', label: 'VNPay',               icon: '🏦' },
  { id: 'Momo',  label: 'Ví MoMo',             icon: '💜' },
];

function WalletPage() {
  const navigate = useNavigate();
  const [wallet, setWallet]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('wallet'); // 'wallet' | 'history'
  const [history, setHistory]     = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [message, setMessage]     = useState({ text: '', type: '' });

  useEffect(() => { loadWallet(); }, []);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.getWallet();
      if (res.success) {
        setWallet(res.data);
        // sync balance vào localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.balance = res.data.balance;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const loadHistory = async (page = 1) => {
    try {
      const res = await paymentApi.getHistory(page, 20);
      if (res.success) {
        if (page === 1) setHistory(res.data);
        else setHistory(prev => [...prev, ...res.data]);
        setHasMore(res.data.length === 20);
        setHistoryPage(page);
      }
    } catch { /* ignore */ }
  };

  const handleTabChange = (t) => {
    setTab(t);
    if (t === 'history' && history.length === 0) loadHistory(1);
  };

  const handleTopUpSuccess = (tx) => {
    setTopUpOpen(false);
    showMessage(`Nạp ${tx.formattedAmount} thành công!`, 'success');
    loadWallet();
    if (tab === 'history') loadHistory(1);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n ?? 0) + ' VNĐ';

  if (loading) return (
    <div className="wallet-page">
      <div className="wallet-skeleton">
        <div className="sk-card" />
        <div className="sk-card sk-short" />
      </div>
    </div>
  );

  return (
    <div className="wallet-page">
      {/* Header */}
      <div className="wallet-header">
        <div className="wallet-header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>← Quay lại</button>
          <h1>💳 Ví của tôi</h1>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`wallet-alert wallet-alert-${message.type}`}>{message.text}</div>
      )}

      {/* Balance card */}
      <div className="balance-card">
        <div className="balance-card-inner">
          <div className="balance-section">
            <span className="balance-label">Số dư khả dụng</span>
            <span className="balance-amount">{fmt(wallet?.balance)}</span>
          </div>
          <button className="btn-topup" onClick={() => setTopUpOpen(true)}>
            + Nạp tiền
          </button>
        </div>

        {/* Stats row */}
        {wallet && (
          <div className="wallet-stats">
            <div className="wallet-stat">
              <span className="stat-label">Tổng nạp</span>
              <span className="stat-value stat-up">+{fmt(wallet.totalTopUp)}</span>
            </div>
            <div className="wallet-stat-divider" />
            <div className="wallet-stat">
              <span className="stat-label">Đã chi</span>
              <span className="stat-value stat-down">-{fmt(wallet.totalSpent)}</span>
            </div>
            <div className="wallet-stat-divider" />
            <div className="wallet-stat">
              <span className="stat-label">Thu nhập</span>
              <span className="stat-value stat-earn">+{fmt(wallet.totalEarned)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="wallet-tabs">
        <button
          className={`wallet-tab ${tab === 'wallet' ? 'active' : ''}`}
          onClick={() => handleTabChange('wallet')}
        >
          Giao dịch gần đây
        </button>
        <button
          className={`wallet-tab ${tab === 'history' ? 'active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          Tất cả lịch sử
        </button>
      </div>

      {/* Transaction list */}
      <div className="tx-list">
        {tab === 'wallet' && (
          wallet?.recentTransactions?.length > 0
            ? wallet.recentTransactions.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} />)
            : <EmptyTx onTopUp={() => setTopUpOpen(true)} />
        )}

        {tab === 'history' && (
          history.length > 0
            ? <>
                {history.map(tx => <TxRow key={tx.id} tx={tx} fmt={fmt} />)}
                {hasMore && (
                  <button className="btn-load-more"
                    onClick={() => loadHistory(historyPage + 1)}>
                    Xem thêm
                  </button>
                )}
              </>
            : <EmptyTx onTopUp={() => setTopUpOpen(true)} />
        )}
      </div>

      {/* Top-up modal */}
      {topUpOpen && (
        <TopUpModal
          onClose={() => setTopUpOpen(false)}
          onSuccess={handleTopUpSuccess}
        />
      )}
    </div>
  );
}

/* ---- Transaction row ---- */
function TxRow({ tx, fmt }) {
  const colorClass = {
    success: 'tx-success',
    danger:  'tx-danger',
    info:    'tx-info',
    warning: 'tx-warning',
  }[tx.typeColor] || '';

  return (
    <div className="tx-row">
      <div className={`tx-icon ${colorClass}`}>
        {tx.typeIcon === '+' ? '↑' : '↓'}
      </div>
      <div className="tx-info">
        <span className="tx-type">{tx.typeText}</span>
        <span className="tx-desc">{tx.description}</span>
        <span className="tx-time">{tx.timeAgo}</span>
      </div>
      <div className="tx-amounts">
        <span className={`tx-amount ${colorClass}`}>{tx.formattedAmount}</span>
        <span className="tx-balance">Số dư: {fmt(tx.balanceAfter)}</span>
      </div>
    </div>
  );
}

/* ---- Empty state ---- */
function EmptyTx({ onTopUp }) {
  return (
    <div className="tx-empty">
      <span className="tx-empty-icon">📭</span>
      <p>Chưa có giao dịch nào</p>
      <button className="btn-topup-empty" onClick={onTopUp}>Nạp tiền ngay</button>
    </div>
  );
}

/* ---- Top-up modal ---- */
function TopUpModal({ onClose, onSuccess }) {
  const [amount, setAmount]   = useState('');
  const [method, setMethod]   = useState('Mock');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handlePreset = (v) => setAmount(String(v));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseInt(amount.replace(/\D/g, ''), 10);
    if (!parsed || parsed < 10000) {
      setError('Số tiền tối thiểu là 10,000 VNĐ');
      return;
    }
    if (parsed > 50000000) {
      setError('Số tiền tối đa là 50,000,000 VNĐ');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await paymentApi.topUp({ amount: parsed, paymentMethod: method });
      if (res.success) onSuccess(res.data);
      else setError(res.message || 'Nạp tiền thất bại');
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="topup-modal" onClick={e => e.stopPropagation()}>
        <div className="topup-modal-header">
          <h2>+ Nạp tiền vào ví</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="topup-error">{error}</div>}

          {/* Preset amounts */}
          <div className="preset-group">
            <label>Chọn số tiền nhanh</label>
            <div className="preset-grid">
              {TOP_UP_PRESETS.map(v => (
                <button
                  key={v}
                  type="button"
                  className={`preset-btn ${amount === String(v) ? 'selected' : ''}`}
                  onClick={() => handlePreset(v)}
                >
                  {fmt(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="topup-form-group">
            <label>Hoặc nhập số tiền khác</label>
            <div className="amount-input-wrap">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Nhập số tiền..."
                min={10000}
                max={50000000}
              />
              <span className="amount-unit">VNĐ</span>
            </div>
            {amount && parseInt(amount) >= 10000 && (
              <p className="amount-preview">
                = {fmt(parseInt(amount))} VNĐ
              </p>
            )}
          </div>

          {/* Payment method */}
          <div className="topup-form-group">
            <label>Phương thức thanh toán</label>
            <div className="method-grid">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`method-btn ${method === m.id ? 'selected' : ''}`}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="method-icon">{m.icon}</span>
                  <span className="method-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="topup-actions">
            <button type="button" className="btn-cancel-topup" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="btn-confirm-topup"
              disabled={loading || !amount}
            >
              {loading ? (
                <span className="loading-spinner">⏳ Đang xử lý...</span>
              ) : (
                `✓ Xác nhận nạp${amount ? ' ' + fmt(parseInt(amount)) + ' VNĐ' : ''}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WalletPage;