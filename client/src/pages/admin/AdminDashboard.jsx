import { useEffect, useState } from "react";
import api from "../../services/api";
import Skeleton from "../../components/Skeleton.jsx";

const StatCard = ({ label, value }) => (
  <div className="glass rounded-2xl p-6">
    <p className="text-cream/60 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold gradient-text">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/dashboard");
        setStats(data.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const monthlyEntries = stats ? Object.entries(stats.monthlyStats).sort() : [];
  const maxCount = Math.max(1, ...monthlyEntries.map(([, v]) => v));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>

      {loading ? (
        <div className="grid md:grid-cols-5 gap-4 mb-10">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-4 mb-10">
          <StatCard label="Upcoming Bookings" value={stats.upcomingBookings} />
          <StatCard label="Today's Bookings" value={stats.todaysBookings} />
          <StatCard label="Completed Shoots" value={stats.completedShoots} />
          <StatCard label="Cancelled" value={stats.cancelledBookings} />
          <StatCard label="Pending" value={stats.pendingBookings} />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Bookings This Month</h2>
          {loading ? (
            <Skeleton className="h-48" />
          ) : monthlyEntries.length === 0 ? (
            <p className="text-cream/50 text-sm">No bookings yet this month.</p>
          ) : (
            <div className="flex items-end gap-2 h-48">
              {monthlyEntries.map(([day, count]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-brand rounded-t"
                    style={{ height: `${(count / maxCount) * 100}%`, minHeight: 4 }}
                    title={`${day}: ${count}`}
                  />
                  <span className="text-[10px] text-cream/40 rotate-45 origin-left">{day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Recent Customers</h2>
          {loading ? (
            <Skeleton className="h-48" />
          ) : (
            <ul className="space-y-3">
              {stats.recentCustomers.map((c) => (
                <li key={c.id} className="text-sm">
                  <p className="text-cream font-medium">{c.name}</p>
                  <p className="text-cream/50 text-xs">{c.phone} · {c.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
