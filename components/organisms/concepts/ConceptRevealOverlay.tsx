"use client";

import { motion, AnimatePresence } from "framer-motion";

type ConceptRevealOverlayProps = {
  onReveal: () => void;
  isVisible: boolean;
};

export default function ConceptRevealOverlay({ onReveal, isVisible }: ConceptRevealOverlayProps) {
  const handleReveal = () => {
    onReveal();
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.5,
            transition: {
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] bg-[#F5F1EB] flex flex-col items-center justify-center px-4"
        >
          {/* EGIFT365.VN */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-[#3D2817] text-sm mb-4 font-medium tracking-wide"
          >
            EGIFT365.VN
          </motion.p>

          {/* "Gõ cửa, cửa mở" */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#3D2817] text-lg md:text-xl mb-8 font-medium"
          >
            &quot;Gõ cửa, cửa mở&quot;
          </motion.p>

          {/* Button MỞ */}
          <motion.button
            onClick={handleReveal}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { delay: 0.3, duration: 0.5 },
              scale: { delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 },
              y: {
                delay: 0.8,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-[#8B6F47] shadow-lg hover:shadow-xl flex items-center justify-center mb-8"
            aria-label="Mở để xem nội dung"
          >
            <span className="text-[#FFD700] text-4xl md:text-5xl font-bold">
              MỞ
            </span>
          </motion.button>

          {/* CHẠM ĐỂ KHAI MỞ */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-[#8B6F47] text-sm md:text-base font-light"
          >
            CHẠM ĐỂ KHAI MỞ
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
