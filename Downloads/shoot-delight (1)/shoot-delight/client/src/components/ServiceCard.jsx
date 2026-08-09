import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiClock, HiArrowRight } from "react-icons/hi";

export default function ServiceCard({ service }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl p-6 flex flex-col justify-between h-full"
    >
      <div>
        <h3 className="font-display text-xl font-semibold text-cream mb-2">{service.title}</h3>
        <p className="text-sm text-cream/70 mb-4">{service.description}</p>
        <div className="flex items-center gap-2 text-xs text-brand/90 mb-4">
          <HiClock />
          <span>{service.duration}</span>
          {service.price && <span className="ml-2 text-cream/60">from ₹{service.price}</span>}
        </div>
      </div>
      <Link
        to={`/booking?serviceId=${service.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2 transition-all"
      >
        Book Now <HiArrowRight />
      </Link>
    </motion.div>
  );
}
