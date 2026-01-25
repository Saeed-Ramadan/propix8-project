import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

const ScrollToButton = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // If we are in the first 30% of the page, we consider ourselves "at top"
      const scrolled = window.scrollY;
      const threshold = window.innerHeight * 0.3;
      setIsAtTop(scrolled < threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToggle = () => {
    if (isAtTop) {
      // Scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleScrollToggle}
      className="fixed bottom-8 right-8 z-[2000] w-14 h-14 bg-[#3E5879] text-white rounded-[0.5rem] shadow-2xl flex items-center justify-center border-4 border-white/20 backdrop-blur-md transition-colors hover:bg-[#2C3E50]"
      title={isAtTop ? "الذهاب للأسفل" : "العودة للأعلى"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isAtTop ? "down" : "up"}
          initial={{ y: isAtTop ? -10 : 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: isAtTop ? 10 : -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isAtTop ? <ArrowDown size={28} /> : <ArrowUp size={28} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ScrollToButton;
