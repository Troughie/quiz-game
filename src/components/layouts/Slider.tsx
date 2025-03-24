import useResize from "@/hooks/useResize";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion as m, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface SliderProps<T extends Record<string, any>> {
  data: T[];
  Component: React.ComponentType<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Slider = <T extends Record<string, any>>({
  data,
  Component,
}: SliderProps<T>) => {
  const { width } = useResize();
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const slideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const widthTotal = slideRef.current?.offsetWidth;
    const widthElement = elementRef.current?.offsetWidth;
    if (widthTotal && widthElement) {
      const elements = Math.ceil(widthTotal / widthElement);
      const maxPage = Math.ceil(data.length / elements);

      if (page > maxPage - 1) setPage(maxPage);
      setMaxPage(maxPage);
    }
  }, [width, data.length, page]);

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

        <div ref={slideRef} className="overflow-hidden h-auto md:h-[200px]">
          <AnimatePresence initial={false}>
            <m.div
              animate={{ x: `-${page * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex h-full"
            >
              {data.map((item, index) => (
                <Component ref={elementRef} key={index} {...item} />
              ))}
            </m.div>
          </AnimatePresence>
        </div>
        {page < maxPage - 1 && (
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
