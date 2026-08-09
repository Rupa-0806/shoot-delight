import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/brand/logo-nav.png" alt="Shoot Delight" className="h-10 md:h-12 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-brand ${
                  isActive ? "text-brand" : "text-cream/90"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/booking" className="btn-primary !py-2 !px-5 text-sm">
            Book Now
          </Link>
        </div>

        <button
          className="md:hidden text-2xl text-cream"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass px-6 pb-6 flex flex-col gap-4 overflow-hidden"
          >
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-cream/90 hover:text-brand">
                {l.label}
              </NavLink>
            ))}
            <Link to="/booking" onClick={() => setOpen(false)} className="btn-primary justify-center">
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
