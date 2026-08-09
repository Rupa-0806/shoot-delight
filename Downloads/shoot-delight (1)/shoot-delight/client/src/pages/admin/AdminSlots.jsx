import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";

const DEFAULT_TIMES = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

export default function AdminSlots() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { date: "", times: DEFAULT_TIMES } });
  const [viewDate, setViewDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const createSlots = async (values) => {
    const times = Array.isArray(values.times) ? values.times : [values.times];
    try {
      await api.post("/slots", { date: values.date, times });
      toast.success("Slots created");
      if (values.date === viewDate) loadSlots(viewDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create slots");
    }
  };

  const loadSlots = async (date) => {
    if (!date) return;
    setLoading(true);
    setViewDate(date);
    try {
      const { data } = await api.get("/slots", { params: { date } });
      setSlots(data.data);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (slot) => {
    try {
      await api.put(`/slots/${slot.id}/${slot.isBlocked ? "unblock" : "block"}`);
      loadSlots(viewDate);
    } catch {
      toast.error("Failed to update slot");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this slot?")) return;
    try {
      await api.delete(`/slots/${id}`);
      toast.success("Slot deleted");
      loadSlots(viewDate);
    } catch {
      toast.error("Failed to delete - it may be tied to a booking");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Slot Management</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(createSlots)} className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold mb-2">Create / Add Slots for a Date</h2>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="date" {...register("date", { required: true })} className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-2 focus:outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-sm mb-2">Time Slots</label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_TIMES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-cream/80">
                  <input type="checkbox" value={t} defaultChecked {...register("times")} className="accent-brand" />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary w-full justify-center">Add Slots</button>
          <p className="text-xs text-cream/40">Marking a date's slots as blocked (below) is how you mark a holiday.</p>
        </form>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">View / Manage Slots</h2>
          <input
            type="date"
            value={viewDate}
            onChange={(e) => loadSlots(e.target.value)}
            className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-brand"
          />
          {loading ? (
            <p className="text-cream/50 text-sm">Loading…</p>
          ) : !viewDate ? (
            <p className="text-cream/50 text-sm">Pick a date to view its slots.</p>
          ) : slots.length === 0 ? (
            <p className="text-cream/50 text-sm">No slots for this date yet.</p>
          ) : (
            <ul className="space-y-2">
              {slots.map((s) => (
                <li key={s.id} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2 text-sm">
                  <span className={s.bookingId ? "text-cream/40 line-through" : ""}>{s.time}</span>
                  <div className="flex gap-3 items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.bookingId ? "bg-blue-500/20 text-blue-400" : s.isBlocked ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                    }`}>
                      {s.bookingId ? "Booked" : s.isBlocked ? "Blocked" : "Available"}
                    </span>
                    {!s.bookingId && (
                      <button onClick={() => toggleBlock(s)} className="text-xs text-brand hover:underline">
                        {s.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                    {!s.bookingId && (
                      <button onClick={() => remove(s.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
