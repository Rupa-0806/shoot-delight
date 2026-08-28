import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPhone, FaWhatsapp, FaEnvelope, FaInstagram, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const IG_URL = import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/shoot_delight_/";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Simple contact form - not wired to a backend endpoint, opens the user's mail client
  const onSubmit = (values) => {
    const subject = encodeURIComponent(`Website inquiry from ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\nFrom: ${values.name} (${values.email})`);
    window.location.href = `mailto:shootdelight678@gmail.com?subject=${subject}&body=${body}`;
    toast.success("Opening your email client…");
    reset();
  };

  return (
    <div className="section max-w-5xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">Get in Touch</h1>
      <p className="text-center text-cream/60 mb-12">Questions about a shoot? We'd love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <FaPhone className="text-2xl text-brand" />
            <div>
              <p className="font-semibold">Phone</p>
              <a href="tel:+918919080514" className="text-cream/70 text-sm hover:text-brand">+91 89190 80514</a>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <FaWhatsapp className="text-2xl text-brand" />
            <div>
              <p className="font-semibold">WhatsApp</p>
              <a href="https://wa.me/918919080514" target="_blank" rel="noreferrer" className="text-cream/70 text-sm hover:text-brand">Chat with us</a>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <FaEnvelope className="text-2xl text-brand" />
            <div>
              <p className="font-semibold">Email</p>
              <a href="mailto:shootdelight678@gmail.com" className="text-cream/70 text-sm hover:text-brand">shootdelight678@gmail.com</a>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <FaInstagram className="text-2xl text-brand" />
            <div>
              <p className="font-semibold">Instagram</p>
              <a href={IG_URL} target="_blank" rel="noreferrer" className="text-cream/70 text-sm hover:text-brand">@shoot.delight</a>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <FaMapMarkerAlt className="text-2xl text-brand" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-cream/70 text-sm">Available across the city — ask us about your area</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center gap-4">
            <FaClock className="text-2xl text-brand" />
            <div>
              <p className="font-semibold">Business Hours</p>
              <p className="text-cream/70 text-sm">Mon – Sun, 9:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-5 h-fit">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input {...register("name", { required: true })} className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand" />
            {errors.name && <p className="text-red-400 text-xs mt-1">Name is required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" {...register("email", { required: true })} className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand" />
            {errors.email && <p className="text-red-400 text-xs mt-1">Email is required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea rows={4} {...register("message", { required: true })} className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand" />
            {errors.message && <p className="text-red-400 text-xs mt-1">Message is required</p>}
          </div>
          <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
        </form>
      </div>
    </div>
  );
}
