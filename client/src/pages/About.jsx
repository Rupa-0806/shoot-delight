import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function About() {
  return (
    <div className="section max-w-4xl mx-auto">
      <motion.h1 {...fadeUp} className="font-display text-4xl md:text-5xl font-bold text-center mb-6">
        Meet <span className="gradient-text">Shoot Delight</span>
      </motion.h1>
      <motion.p {...fadeUp} className="text-center text-cream/70 max-w-2xl mx-auto mb-16">
        We're an Instagram-first content creation studio, turning everyday moments and brands into reels people actually stop scrolling for.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div {...fadeUp} className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl font-semibold mb-3">Our Story</h2>
          <p className="text-cream/70 text-sm leading-relaxed">
            Shoot Delight started with a simple idea — every moment, big or small, deserves to be told beautifully.
            What began as shooting reels for friends turned into a full-fledged content studio serving individuals
            and brands who wanted their Instagram presence to feel as good as the moment itself.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-cream/70 text-sm leading-relaxed">
            To make cinematic-quality content creation accessible — for birthdays, weddings, festivals, and
            businesses alike — using nothing more than an iPhone, thoughtful direction, and skilled editing.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl font-semibold mb-3">Our Vision</h2>
          <p className="text-cream/70 text-sm leading-relaxed">
            To become the go-to name for Instagram-native content — known for storytelling, consistency, and
            making every client's feed a little more delightful.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl font-semibold mb-3">Our Creative Process</h2>
          <p className="text-cream/70 text-sm leading-relaxed">
            We start with your story — the vibe, the occasion, the vision. From framing and direction on set to
            color grading and pacing in the edit, every shoot is treated as a mini film, not just a video.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
