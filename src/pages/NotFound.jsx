import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MapPinned, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#f8f9fa] font-cairo overflow-hidden relative">
      {/* Background Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 text-[#3E5879] opacity-5"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MapPinned size={150} />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-[#3E5879] opacity-5"
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <AlertCircle size={180} />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <motion.h1
          className="text-[10rem] md:text-[12rem] font-black text-[#3E5879] leading-none select-none drop-shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.2,
          }}
        >
          404
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          عذراً، هذه الصفحة مفقودة!
        </motion.h2>

        <motion.p
          className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto mb-10 font-medium leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          الرابط الذي تحاول الوصول إليه قد يكون غير صحيح أو تم حذفه. لا تقلق،
          يمكنك العودة للرئيسية واستكمال تصفح عقاراتنا المميزة.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-[#3E5879] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-[#2c405b] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <Home
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
            العودة للرئيسية
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
