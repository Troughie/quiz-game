import { useState, useEffect } from "react";

/**
 * Custom hook để tạo một giá trị debounced
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay tính bằng milliseconds
 * @returns Giá trị sau khi đã được debounce
 */
function useDebounce<T>(value: T, delay: number): T {
  // State để lưu giá trị debounced
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Tạo timeout để update giá trị debounced sau một khoảng thời gian
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function để clear timeout nếu value hoặc delay thay đổi
    // hoặc component unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ re-run effect nếu value hoặc delay thay đổi

  return debouncedValue;
}

export default useDebounce;
