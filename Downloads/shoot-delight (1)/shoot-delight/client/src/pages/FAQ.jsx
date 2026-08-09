import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const faqs = [
  { q: "How do I book a shoot?", a: "Head to the Booking page, choose your service and package, pick an available date and time slot, and fill in your details. You'll get an instant confirmation email." },
  { q: "Do you store or upload my photos/videos on this website?", a: "No. We never upload or store media on the website. All our finished work is shared on our Instagram page, and final files are delivered to you directly." },
  { q: "What if my preferred time slot is already booked?", a: "Booked slots automatically become unavailable. Simply pick another available slot or date." },
  { q: "How soon will I receive my edited reels?", a: "Typical turnaround is 24-48 hours depending on the package and shoot complexity." },
  { q: "Can I request revisions?", a: "Yes — the number of included revisions depends on your chosen package. Additional revisions can be discussed directly with our team." },
  { q: "Do you travel outside the city for shoots?", a: "Yes, for select event types. Mention your location in the booking form and we'll confirm feasibility." },
  { q: "How do I cancel or reschedule a booking?", a: "Contact us via phone, WhatsApp, or email as soon as possible and we'll help you reschedule or cancel." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="section max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">Frequently Asked Questions</h1>
      <p className="text-center text-cream/60 mb-12">Everything you need to know before booking.</p>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left font-medium"
            >
              {f.q}
              <HiChevronDown className={`text-brand transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="px-6 pb-5 text-cream/70 text-sm leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
