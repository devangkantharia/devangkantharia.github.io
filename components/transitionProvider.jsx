"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
// import Navbar from "./navbar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};

const TransitionProvider = ({ children }) => {
  const pathName = usePathname();
  const isClient = useIsClient();

  return (
    <AnimatePresence mode="wait">
      <div key={pathName} className="z-50">
        {/* <motion.div
          className="fixed z-40 h-screen w-screen rounded-b-[100px] bg-gray-600 opacity-50"
          animate={{ height: "0vh" }}
          exit={{ height: "140vh" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        /> */}
        <motion.div
          className="fixed top-0 right-0 bottom-0 left-0 z-50 m-auto h-fit w-fit cursor-default text-8xl text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {pathName.substring(1)}
        </motion.div>
        {isClient && (
          <motion.div
            className="fixed bottom-0 z-50 h-screen w-screen rounded-t-[100px] bg-[#22202a] dark:bg-white"
            initial={{ height: "140vh" }}
            animate={{ height: "0vh", transition: { delay: 0.5 } }}
          />
        )}
        {/* <div className="h-24">
          <Navbar />
        </div> */}
        <div className="h-[calc(100vh-6rem)]">{children}</div>
      </div>
    </AnimatePresence>
  );
};

export default TransitionProvider;
