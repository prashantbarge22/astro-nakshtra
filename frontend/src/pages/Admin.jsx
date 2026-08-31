import { useState, useEffect, useCallback } from "react";
import { Lock, RefreshCw, LogOut, MessageCircle } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_STYLES = {
  pending_confirmation: "bg-champagne/15 text-gold border-gold/30",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-charcoal/5 text-smoke border-charcoal/15",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const label = (s) => s.replace(/_/g, " ");

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("an-admin-token") || "");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (tok) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/bookings`, { headers: { Authorization: `Bearer ${tok}` } });
      if (res.status === 401) {
        localStorage.removeItem("an-admin-token");
        setToken("");
        return;
      }
      setBookings(await res.json());
    } catch {
      setError("Could not load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (token) load(token); }, [token, load]);

  const login = async () => {
    setError("");
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setError("Wrong password"); return; }
      const data = await res.json();
      localStorage.setItem("an-admin-token", data.token);
      setToken(data.token);
    } catch {
      setError("Could not sign in");
    }
  };

  const setStatus = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    load(token);
  };

  const logout = () => {
    localStorage.removeItem("an-admin-token");
    setToken("");
    setBookings(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-cream/60 border border-gold/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-5">
            <Lock size={20} strokeWidth={1.5} />
          </span>
          <h1 className="font-serif text-2xl text-charcoal">ASTRO <span className="italic text-gold">Nakshatra</span></h1>
          <p className="mt-1 text-sm text-smoke">Admin — bookings</p>
          <input
            data-testid="admin-login-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Admin password"
            className="mt-6 w-full rounded-xl border border-charcoal/15 bg-ivory px-4 py-3 text-sm text-charcoal"
          />
          {error && <p className="mt-3 text-sm text-red-600" data-testid="admin-login-error">{error}</p>}
          <button
            data-testid="admin-login-button"
            onClick={login}
            className="mt-5 w-full rounded-full bg-charcoal text-ivory font-semibold text-sm py-3.5 hover:bg-gold hover:text-charcoal transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">Bookings</h1>
            <p className="text-sm text-smoke mt-1" data-testid="admin-bookings-count">
              {bookings ? `${bookings.length} total` : "Loading…"}
            </p>
          </div>
          <div className="flex gap-3">
            <button data-testid="admin-refresh-button" onClick={() => load(token)} className="rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-semibold text-smoke hover:text-charcoal transition-colors flex items-center gap-2">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button data-testid="admin-logout-button" onClick={logout} className="rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-semibold text-smoke hover:text-charcoal transition-colors flex items-center gap-2">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4" data-testid="admin-bookings-list">
          {bookings && bookings.length === 0 && (
            <p className="text-smoke text-sm">No bookings yet.</p>
          )}
          {bookings && bookings.map((b, i) => (
            <div key={b.id} data-testid={`admin-booking-${i}`} className="bg-cream/50 border border-charcoal/10 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl text-charcoal">{b.full_name}</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-smoke/70 mt-1">
                    Ref {b.id.slice(0, 8).toUpperCase()} · {b.package === "blueprint" ? "Astral Blueprint" : "Consultation"} · ₹{b.amount}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${b.payment_status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-charcoal/5 text-smoke border-charcoal/15"}`}>
                    {b.payment_status === "paid" ? "PAID" : b.payment_status.toUpperCase()}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_STYLES[b.status] || STATUS_STYLES.pending_confirmation}`} data-testid={`admin-booking-status-${i}`}>
                    {label(b.status).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-3 gap-x-6 gap-y-1.5 text-sm text-smoke">
                <p>DOB: <span className="text-charcoal">{b.dob} · {b.birth_time}</span></p>
                <p>Place: <span className="text-charcoal">{b.birth_place}</span></p>
                <p>Slot: <span className="text-charcoal">{b.preferred_day} · {b.preferred_time}</span></p>
                <p>Email: <span className="text-charcoal">{b.email}</span></p>
                <p>Phone: <span className="text-charcoal">{b.phone}</span></p>
                <p>Booked: <span className="text-charcoal">{new Date(b.created_at).toLocaleString("en-IN")}</span></p>
              </div>
              {b.questions && (
                <p className="mt-3 text-sm text-smoke italic border-l-2 border-gold/40 pl-3">“{b.questions}”</p>
              )}
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  data-testid={`admin-booking-whatsapp-${i}`}
                  href={`https://wa.me/${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Namaste ${b.full_name}, this is Astro Nakshatra confirming your booking (Ref ${b.id.slice(0, 8).toUpperCase()}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-charcoal text-ivory text-xs font-semibold px-4 py-2.5 flex items-center gap-1.5 hover:bg-gold hover:text-charcoal transition-colors"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
                {b.status === "pending_confirmation" && (
                  <button data-testid={`admin-booking-confirm-${i}`} onClick={() => setStatus(b.id, "confirmed")} className="rounded-full border border-emerald-300 text-emerald-700 text-xs font-semibold px-4 py-2.5 hover:bg-emerald-50 transition-colors">
                    Mark confirmed
                  </button>
                )}
                {(b.status === "pending_confirmation" || b.status === "confirmed") && (
                  <button data-testid={`admin-booking-complete-${i}`} onClick={() => setStatus(b.id, "completed")} className="rounded-full border border-charcoal/20 text-smoke text-xs font-semibold px-4 py-2.5 hover:bg-charcoal/5 transition-colors">
                    Mark completed
                  </button>
                )}
                {b.status !== "cancelled" && (
                  <button data-testid={`admin-booking-cancel-${i}`} onClick={() => setStatus(b.id, "cancelled")} className="rounded-full border border-red-200 text-red-600 text-xs font-semibold px-4 py-2.5 hover:bg-red-50 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
