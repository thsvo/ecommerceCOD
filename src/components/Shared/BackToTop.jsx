"use client";

import { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-[10%] right-1 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-primary text-white rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-base cursor-pointer"
        >
          <IoIosArrowUp />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
