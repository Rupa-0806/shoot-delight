import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Skeleton from "../../components/Skeleton.jsx";

const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  ACCEPTED: "bg-blue-500/20 text-blue-400",
  COMPLETED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
  CANCELLED: "bg-cream/10 text-cream/50",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings", { params: { search, status: statusFilter } });
      setBookings(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      toast.success(`Booking marked as ${status.toLowerCase()}`);
      load();
      setSelected(null);
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const verifyAdvance = async (id) => {
    try {
      await api.put(`/bookings/${id}`, { advancePaymentStatus: "VERIFIED" });
      toast.success("Advance payment marked as verified");
      load();
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this booking permanently?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking deleted");
      load();
      setSelected(null);
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Bookings</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          placeholder="Search by name, phone, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-cream/20 rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:border-brand"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-cream/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand"
        >
          <option value="">All statuses</option>
          {["PENDING", "ACCEPTED", "COMPLETED", "REJECTED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : bookings.length === 0 ? (
        <p className="text-cream/50">No bookings found.</p>
      ) : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-cream/10 text-cream/60">
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date / Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Advance</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-cream/5 hover:bg-white/5">
                  <td className="p-4">
                    <button className="text-left hover:text-brand" onClick={() => setSelected(b)}>
                      <p className="font-medium">{b.customer.name}</p>
                      <p className="text-cream/50 text-xs">{b.customer.phone}</p>
                    </button>
                  </td>
                  <td className="p-4">{b.service.title}</td>
                  <td className="p-4">{new Date(b.bookingDate).toLocaleDateString()} · {b.bookingTime}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="p-4">
                    
                    {b.advancePaymentStatus === "SUBMITTED" && (
                      <button onClick={() => verifyAdvance(b.id)} className="block text-xs text-green-400 hover:underline mt-1">
                        Verify
                      </button>
                    )}
                  </td>
                  <td className="p-4 space-x-2 whitespace-nowrap">
                    {b.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(b.id, "ACCEPTED")} className="text-xs text-blue-400 hover:underline">Accept</button>
                        <button onClick={() => updateStatus(b.id, "REJECTED")} className="text-xs text-red-400 hover:underline">Reject</button>
                      </>
                    )}
                    {b.status === "ACCEPTED" && (
                      <button onClick={() => updateStatus(b.id, "COMPLETED")} className="text-xs text-green-400 hover:underline">Complete</button>
                    )}
                    <button onClick={() => remove(b.id)} className="text-xs text-cream/50 hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-4">Booking Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-cream/50">Name</dt><dd>{selected.customer.name}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Phone</dt><dd>{selected.customer.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Email</dt><dd>{selected.customer.email}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Instagram</dt><dd>{selected.customer.instagram || "-"}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Service</dt><dd>{selected.service.title}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Package</dt><dd>{selected.package?.name || "-"}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Event Type</dt><dd>{selected.eventType}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Address</dt><dd className="text-right">{selected.eventAddress}</dd></div>
              <div className="flex justify-between"><dt className="text-cream/50">Notes</dt><dd className="text-right">{selected.specialRequirements || "-"}</dd></div>
            </dl>
            <button onClick={() => setSelected(null)} className="btn-outline w-full justify-center mt-6">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
