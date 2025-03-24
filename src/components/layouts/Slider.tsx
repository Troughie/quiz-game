import useResize from "@/hooks/useResize";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion as m, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SliderProps<T extends Record<string, any>> {
  data: T[];
  Component: React.ComponentType<T>;
}

const getItemsPerPage = (width: number) => {
  if (width < 640) return 2; // sm
  if (width < 1024) return 4; // lg
  if (width < 1280) return 5; // xl
  return 6; // 2xl
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Slider = <T extends Record<string, any>>({
  data,
  Component,
}: SliderProps<T>) => {
  const { width } = useResize();
  const itemsPerPage = useMemo(() => getItemsPerPage(width), [width]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    console.log(itemsPerPage);

    setPage(0); // Reset về trang đầu khi thay đổi số lượng items per page
  }, [itemsPerPage]);

  const maxPage = Math.floor(data.length / itemsPerPage);

  const handleScroll = (direction: "left" | "right") => {
    setPage((prev) => {
      if (direction === "left") return Math.max(prev - 1, 0);
      if (direction === "right") return Math.min(prev + 1, maxPage);
      return prev;
    });
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Recently published</h1>
      <div className="relative">
        {page > 0 && (
          <ChevronLeftIcon
            onClick={() => handleScroll("left")}
            className="size-15 absolute z-10 -left-2 top-1/4 p-1 opacity-90 hover:opacity-100 transition-opacity duration-300 rounded-full bg-white"
          />
        )}
        <div className="overflow-hidden h-[200px]">
          <AnimatePresence initial={false}>
            <m.div
              animate={{ x: `-${page * 100}%` }} // Dịch chuyển theo trang
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex gap-4 h-full"
            >
              {data.map((item, index) => (
                <Component key={index} {...item} />
              ))}
            </m.div>
          </AnimatePresence>
        </div>
        {page < maxPage && (
          <ChevronRightIcon
            onClick={() => handleScroll("right")}
            className="size-15 absolute z-10 right-0 top-1/4 p-1 hover:opacity-100 transition-opacity duration-300 opacity-90 rounded-full bg-white"
          />
        )}
      </div>
    </>
  );
};

export default Slider;
