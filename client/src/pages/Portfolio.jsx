import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const IG_URL = import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/shoot_delight_/";

const categories = [
  { title: "Wedding Reels", desc: "Cinematic highlights from real weddings." },
  { title: "Birthday Reels", desc: "Fun, candid coverage of birthday celebrations." },
  { title: "Business Promotions", desc: "Brand stories told through short-form video." },
  { title: "Festival Reels", desc: "Vibrant, festive moments captured in motion." },
  { title: "Product Shoots", desc: "Clean, conversion-ready product content." },
];

export default function Portfolio() {
  return (
    <div className="section">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">Our Portfolio</h1>
      <p className="text-center text-cream/60 max-w-xl mx-auto mb-12">
        See our latest work directly on Instagram — updated with every shoot.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((c) => (
          <motion.a
            key={c.title}
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-8 flex items-center justify-between group"
          >
            <div>
              <h3 className="font-display text-xl font-semibold mb-1">{c.title}</h3>
              <p className="text-sm text-cream/60">{c.desc}</p>
            </div>
            <span className="flex items-center gap-2 text-brand font-semibold text-sm shrink-0 ml-4 group-hover:gap-3 transition-all">
              <FaInstagram className="text-xl" /> View on Instagram
            </span>
          </motion.a>
        ))}
      </div>

      <div className="text-center mt-16 glass rounded-2xl p-10">
        <FaInstagram className="text-5xl text-brand mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Follow us for more</h2>
        <p className="text-cream/60 mb-6">All our work lives on Instagram — no media is stored on this site.</p>
        <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-primary">
          <FaInstagram /> @shoot.delight
        </a>
      </div>
    </div>
  );
}
