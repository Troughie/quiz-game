import cn from "@/HOC/cn";
import React, { useEffect, useState } from "react";
import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion as m } from "framer-motion";

interface inputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  name: string;
  maxLength: number;
  backgroundColor?: string;
  borderColor?: string;
  col?: number;
  row?: number;
  classNameContainer?: string;
  defaultValue?: string;
  showIcon?: boolean;
  isTrueIcon?: boolean;
  clickIcon?: () => void;
  showText?: boolean;
  index?: number;
  showDelete?: boolean;
  clickDelete?: () => void;
  showLengthText?: boolean;
}

const InputQuiz = ({
  placeholder,
  maxLength,
  name,
  borderColor,
  col = 20,
  row = 2,
  classNameContainer,
  showIcon = false,
  isTrueIcon = false,
  clickIcon,
  showText = false,
  index,
  showDelete = false,
  showLengthText = true,
  clickDelete,
  ...props
}: inputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value || "");
  const [icon, setIcon] = useState<boolean>();

  const clearValue = () => {
    setCurrentValue("");
  };

  useEffect(() => {
    if (props.value !== undefined) {
      setCurrentValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    setIcon(isTrueIcon);
  }, [isTrueIcon]);

  const remainingChars =
    maxLength - (typeof currentValue === "string" ? currentValue.length : 0);
  const isNearLimit = remainingChars <= 20;
  const isAtLimit = remainingChars <= 0;

  return (
    <div className={cn("relative group w-full", classNameContainer)}>
      <div className="flex gap-3 items-center w-full">
        {/* Status Icon Button */}
        {showIcon && (
          <div className="flex-shrink-0 mt-1 pl-2">
            <button
              onClick={clickIcon}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "transition-all duration-300 hover:scale-105 active:scale-95",
                "shadow-lg hover:shadow-xl",
                "border-2 border-white/20 cursor-pointer",
                !icon
                  ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              )}
            >
              {!icon ? (
                <XMarkIcon className="size-6 text-white drop-shadow-sm" />
              ) : (
                <CheckIcon className="size-6 text-white drop-shadow-sm" />
              )}
            </button>
          </div>
        )}

        {/* Question Number */}
        {showText && (
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-white drop-shadow-lg bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text ">
              {(index || 0) + 1}.
            </span>
          </div>
        )}

        {/* Main Input Container */}
        <div className="flex-1 relative">
          <div className="relative w-full">
            {currentValue && (
              <m.label
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="font-bold absolute -top-8 z-1 text-xl text-white pointer-events-none"
              >
                {placeholder}
              </m.label>
            )}
            <textarea
              name={name}
              cols={col}
              rows={row}
              maxLength={maxLength}
              {...props}
              value={currentValue || props.value}
              onChange={(e) => {
                setCurrentValue(e.target.value);
                if (props.onChange) {
                  props.onChange(e);
                }
              }}
              placeholder={placeholder ?? "Type your answer here..."}
              className={cn(
                // Base styles
                "w-full p-4 font-medium rounded-xl transition-all duration-300",
                "bg-white/95 backdrop-blur-sm",
                "border-2 border-emerald-400/60 focus:border-emerald-500",
                "shadow-lg focus:shadow-xl hover:shadow-md hover:-translate-y-1 pr-18",

                // Focus and hover effects
                "focus:outline-none focus:ring-4 focus:ring-emerald-500/20",
                "hover:bg-white focus:bg-white",
                "hover:border-blue-500 focus:border-blue-600",

                // Typography
                "text-gray-800 placeholder:text-gray-400",
                "text-base sm:text-sm md:text-base lg:text-lg leading-relaxed",

                // Layout
                "min-h-[60px] sm:min-h-[60px] md:min-h-[60px] lg:min-h-[60px]",
                "resize-none", // Disable resize for cleaner look

                // Custom border color
                borderColor
              )}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {/* Character Counter & Clear Button */}
          <div
            className={cn(
              "absolute top-3 right-3 flex items-center gap-2 transition-all duration-300",
              isFocused || currentValue
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1"
            )}
          >
            {/* Character Counter */}
            {showLengthText && (isFocused || currentValue) && (
              <div
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm transition-colors duration-300",
                  isAtLimit
                    ? "bg-red-500/90 text-white animate-pulse"
                    : isNearLimit
                    ? "bg-orange-500/90 text-white"
                    : "bg-emerald-600/80 text-white"
                )}
              >
                {remainingChars}
              </div>
            )}

            {/* Clear Button */}
            {currentValue && (
              <button
                onClick={clearValue}
                className={cn(
                  "w-7 h-7 rounded-full bg-gray-600/80 hover:bg-red-500/80 text-white",
                  "flex items-center justify-center text-xs font-bold",
                  "transition-all duration-300 hover:scale-110 active:scale-95",
                  "shadow-sm hover:shadow-md backdrop-blur-sm cursor-pointer"
                )}
                title="Xóa nội dung"
              >
                ×
              </button>
            )}
          </div>
        </div>
        {showDelete && (
          <div onClick={clickDelete}>
            <TrashIcon className="size-8 text-red-500 cursor-pointer hover:scale-110 duration-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputQuiz;
