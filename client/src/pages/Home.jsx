import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineHeart } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard.jsx";
import Skeleton from "../components/Skeleton.jsx";

const IG_URL = import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/shoot_delight_/";

const whyChooseUs = [
  { icon: HiOutlineSparkles, title: "Cinematic Quality", text: "Shot on the latest iPhones, edited with a filmmaker's eye." },
  { icon: HiOutlineLightningBolt, title: "Fast Turnaround", text: "Get your edited reels within 24-48 hours." },
  { icon: HiOutlineHeart, title: "Story-First Approach", text: "Every shoot is built around your moment, not a template." },
];

const steps = [
  { title: "Book Your Slot", text: "Pick a service, date & time." },
  { title: "We Show Up", text: "Our team arrives on time, fully equipped." },
  { title: "We Shoot", text: "Direction, framing, and multiple takes for the best result." },
  { title: "You Get Reels", text: "Edited, color-graded reels delivered to your inbox." },
];

const testimonials = [
  { name: "Ananya R.", text: "Shoot Delight turned my birthday into a cinematic reel my friends still talk about!" },
  { name: "Karthik V.", text: "Booked them for my store's promo video — bookings went up within a week." },
  { name: "Meera S.", text: "Our pre-wedding reel was beyond what we imagined. Super professional team." },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, pRes] = await Promise.all([api.get("/services"),]);
        setServices(sRes.data.data.slice(0, 3));
      } catch (e) {
        // Non-blocking - homepage still renders without live data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="section min-h-[90vh] flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink to-black" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand/20 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand/10 rounded-full blur-3xl -z-10" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight"
        >
          Turn Your Moments Into <span className="gradient-text">Stunning Reels.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-cream/70 max-w-xl text-lg"
        >
          Instagram-first content creation — reels, promos, and event shoots crafted to make your brand and moments unforgettable.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link to="/booking" className="btn-primary">
            Book Now <HiArrowRight />
          </Link>
          <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-outline">
            <FaInstagram /> View Instagram
          </a>
        </motion.div>
      </section>

      {/* Services preview */}
      <section className="section">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">Our Services</h2>
        <p className="text-center text-cream/60 mb-12 max-w-xl mx-auto">
          From birthdays to brand promos — content crafted for every occasion.
        </p>
       
        <div className="text-center mt-10">
          <Link to="/services" className="btn-outline">
            View All Services <HiArrowRight />
          </Link>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-white/[0.02]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {whyChooseUs.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-2xl p-8 text-center">
              <Icon className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-cream/60 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="section">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">How We Work</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="relative glass rounded-2xl p-6">
              <span className="text-5xl font-display font-bold text-brand/20 absolute top-2 right-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold mb-2 relative z-10">{s.title}</h3>
              <p className="text-sm text-cream/60 relative z-10">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      

      {/* Testimonials */}
      <section className="section">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Testimonials</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6">
              <p className="text-cream/80 italic mb-4">"{t.text}"</p>
              <p className="text-brand font-semibold text-sm">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to create something delightful?</h2>
        <p className="text-cream/60 mb-8">Slots are limited each day — book yours now.</p>
        <Link to="/booking" className="btn-primary">
          Book Your Shoot <HiArrowRight />
        </Link>
      </section>
    </div>
  );
}
