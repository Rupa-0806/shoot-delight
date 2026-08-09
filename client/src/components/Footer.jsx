import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";

const IG_URL = import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/shoot_delight_/";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 mt-24">
      <div className="section grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img src="/brand/logo-nav.png" alt="Shoot Delight" className="h-10 mb-3" />
          <p className="text-sm text-cream/60">
            Turning everyday moments into stunning Instagram reels, one shoot at a time.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-cream">Explore</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/services" className="hover:text-brand">Services</Link></li>
            <li><Link to="/packages" className="hover:text-brand">Packages</Link></li>
            <li><Link to="/portfolio" className="hover:text-brand">Portfolio</Link></li>
            <li><Link to="/booking" className="hover:text-brand">Book a Shoot</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-cream">Company</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/about" className="hover:text-brand">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-brand">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-brand">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-brand">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-cream">Connect</h4>
          <div className="flex gap-4 text-2xl text-cream/70">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="hover:text-brand"><FaInstagram /></a>
            <a href="https://wa.me/918919080514" target="_blank" rel="noreferrer" className="hover:text-brand"><FaWhatsapp /></a>
            <a href="mailto:shootdelight678@gmail.com" className="hover:text-brand"><FaEnvelope /></a>
            <a href="tel:+918919080514" className="hover:text-brand"><FaPhone /></a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-cream/40 pb-8">
        © {new Date().getFullYear()} Shoot Delight. All rights reserved.
      </p>
    </footer>
  );
}
