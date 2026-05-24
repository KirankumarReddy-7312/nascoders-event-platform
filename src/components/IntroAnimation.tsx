"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroAnimation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the intro has already been played in this session
    const hasPlayed = sessionStorage.getItem("introPlayed");
    if (!hasPlayed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      sessionStorage.setItem("introPlayed", "true");
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFAF0] overflow-hidden"
        >
          {/* Soft Organic Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"
          />

          {/* Typography Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="text-center z-10"
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-wide text-stone-800 mb-6 font-serif">
              Euphoria
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              className="text-lg md:text-xl text-stone-500 tracking-wide font-light"
            >
              Where every moment becomes a memory.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
