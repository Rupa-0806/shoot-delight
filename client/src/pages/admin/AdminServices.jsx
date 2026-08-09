import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";
import Skeleton from "../../components/Skeleton.jsx";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // service being edited, or "new"
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/services", { params: { all: true } });
      setServices(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (service) => {
    setEditing(service || "new");
    reset(service || { title: "", description: "", duration: "", price: "" });
  };

  const onSubmit = async (values) => {
    try {
      if (editing === "new") {
        await api.post("/services", values);
        toast.success("Service created");
      } else {
        await api.put(`/services/${editing.id}`, values);
        toast.success("Service updated");
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

  const toggleActive = async (s) => {
    try {
      await api.put(`/services/${s.id}`, { active: !s.active });
      load();
    } catch {
      toast.error("Failed to update service");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Service deleted");
      load();
    } catch {
      toast.error("Failed to delete - it may have existing bookings");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold">Services</h1>
        <button onClick={() => openEdit(null)} className="btn-primary !py-2 !px-5 text-sm">+ New Service</button>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{s.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${s.active ? "bg-green-500/20 text-green-400" : "bg-cream/10 text-cream/40"}`}>
                  {s.active ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-cream/60 text-sm mb-3">{s.description}</p>
              <p className="text-xs text-cream/50 mb-4">{s.duration} {s.price ? `· ₹${s.price}` : ""}</p>
              <div className="flex gap-3 text-xs">
                <button onClick={() => openEdit(s)} className="text-brand hover:underline">Edit</button>
                <button onClick={() => toggleActive(s)} className="text-cream/60 hover:underline">
                  {s.active ? "Disable" : "Enable"}
                </button>
                <button onClick={() => remove(s.id)} className="text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50" onClick={() => setEditing(null)}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl p-8 max-w-md w-full space-y-4"
          >
            <h2 className="font-display text-xl font-bold mb-2">{editing === "new" ? "New Service" : "Edit Service"}</h2>
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input {...register("title", { required: true })} className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-2 focus:outline-none focus:border-brand" />
              {errors.title && <p className="text-red-400 text-xs mt-1">Title is required</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea rows={3} {...register("description", { required: true })} className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-2 focus:outline-none focus:border-brand" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Duration</label>
                <input {...register("duration", { required: true })} placeholder="1-2 hrs" className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-2 focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-sm mb-1">Price (optional)</label>
                <input type="number" {...register("price")} className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-2 focus:outline-none focus:border-brand" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
