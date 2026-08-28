import { FaInstagram } from "react-icons/fa";

const IG_URL =
  import.meta.env.VITE_INSTAGRAM_URL ||
  "https://www.instagram.com/shoot_delight_/";

// Showcase examples of past work
const ourWork = [
  {
    title: "Product Reels",
    image: "/work/product-reel.jpg",
    desc: "Details that desire. Quality that converts.",
  },
  {
    title: "Festival Reels",
    image: "/work/festival-reel.jpg",
    desc: "Festivals come and go, but memories glow forever.",
  },
  {
    title: "Business Reels",
    image: "/work/business-reel.jpg",
    desc: "Your brand. Our storytelling. Real impact.",
  },
  {
    title: "Birthday Reels",
    image: "/work/birthday-reel.jpg",
    desc: "Your day, beautifully told.",
  },
  {
    title: "Wedding Reels",
    image: "/work/wedding-reel.jpg",
    desc: "We don't just shoot moments, we create memories.",
  },
];

export default function Services() {
  return (
    <div className="section">
      {/* Page Heading */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Our Services
        </h1>

        <p className="text-cream/60 max-w-xl mx-auto">
          Explore some of the reels we've created for our clients.
        </p>
      </div>

      {/* Our Work */}
      <div className="grid md:grid-cols-3 gap-6">
        {ourWork.map((work) => (
          <a
            key={work.title}
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="group glass rounded-2xl overflow-hidden block"
          >
            {/* Image */}
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-cream mb-1">
                {work.title}
              </h3>

              <p className="text-xs text-cream/60 mb-3">
                {work.desc}
              </p>

              <span className="inline-flex items-center gap-1 text-xs text-brand font-semibold">
                <FaInstagram />
                See more on Instagram
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Instagram Button */}
      <div className="text-center mt-12">
        <a
          href={IG_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-outline inline-flex items-center gap-2"
        >
          <FaInstagram />
          View More on Instagram
        </a>
      </div>
    </div>
  );
}