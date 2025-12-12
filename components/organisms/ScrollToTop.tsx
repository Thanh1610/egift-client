"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Hiển thị nút khi scroll xuống hơn 50% chiều cao trang
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Tính phần trăm đã scroll
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      
      const shouldBeVisible = scrollPercentage > 50;
      setIsVisible(shouldBeVisible);
      
      // Reset hover state khi scroll
      if (!shouldBeVisible) {
        setIsHovered(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsHovered(false); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-1/2 right-0 z-50 h-12 shadow-lg overflow-hidden rounded-l-md rounded-r-none"
      style={{
        width: isHovered ? "auto" : "3rem",
        paddingLeft: isHovered ? "1rem" : "0",
        paddingRight: isHovered ? "1rem" : "0",
        transform: isHovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(calc(100% - 3rem))",
        transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), width 0.7s cubic-bezier(0.4, 0, 0.2, 1), padding 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, width",
      }}
      aria-label="Cuộn lên đầu trang"
    >
      <div className={`flex items-center gap-2 whitespace-nowrap ${!isHovered ? "justify-center" : ""}`}>
        <ArrowUp className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span
          style={{
            opacity: isHovered ? 1 : 0,
            width: isHovered ? "auto" : "0",
            overflow: "hidden",
            transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          lên đầu trang
        </span>
      </div>
    </Button>
  );
}


