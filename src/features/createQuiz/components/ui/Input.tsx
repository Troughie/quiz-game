import cn from "@/HOC/cn";
import React, { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "@/components/ui/ButtonCustom";
interface inputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  title?: string;
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
}
const InputQuiz = ({
  title,
  maxLength,
  name,
  backgroundColor,
  borderColor,
  col = 20,
  row = 2,
  classNameContainer,
  showIcon = false,
  isTrueIcon = false,
  clickIcon,
  showText = false,
  index,
  ...props
}: inputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value || "");
  const [icon, setIcon] = useState<boolean>(isTrueIcon);
  const clearValue = () => {
    setCurrentValue("");
  };
  useEffect(() => {
    if (props.value !== undefined) {
      setCurrentValue(props.value);
    }
  }, [props.value]);

  const handleClickIcon = () => {
    setIcon((prev) => !prev);
    if (clickIcon) clickIcon();
  };

  useEffect(() => {
    setIcon(isTrueIcon ?? false);
  }, [isTrueIcon]);
  return (
    <div className={cn("relative", classNameContainer)}>
      {title && (
        <span
          className={cn(
            "bg-blue-600 p-2 ab rounded-t-lg top-0 left-0 w-[20px] h-2 text-white",
            backgroundColor
          )}
        >
          {title}
        </span>
      )}
      <div className="flex gap-1 items-center">
        {showIcon && (
          <>
            <Button
              onClick={handleClickIcon}
              text={
                !icon ? (
                  <XMarkIcon className="size-10" />
                ) : (
                  <CheckIcon className="size-10" />
                )
              }
              classContainer=" items-center flex ml-2"
              classBg={!icon ? "bg-red-500" : "bg-green-500"}
              classShadow="bg-petrol"
              classText="left-[15px] top-0"
            />
          </>
        )}
        {showText && (
          <span className="text-3xl ml-2 text-white font-bold">
            {index || 0 + 1}.
          </span>
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
          className={cn(
            "bg-white focus:outline-none border-6 border-blue-600 rounded-b-xl w-full p-3 font-medium",
            "hover:bg-white/80 focus:hover:bg-white",
            "text-base sm:text-sm md:text-base lg:text-lg", // Responsive font size
            "min-h-[60px] sm:min-h-[60px] md:min-h-[60px] lg:min-h-[60px] pr-10", // Responsive height
            "resize-y",
            borderColor
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      <div
        className={cn(
          "absolute gap-2 flex items-center justify-center top-8 right-6",
          !title && "top-2"
        )}
      >
        {isFocused && (
          <span
            className={cn(
              "bg-black/20 px-2 py-1 rounded-l-2xl text-sm font-medium",
              !currentValue && "rounded-full"
            )}
          >
            {maxLength -
              (typeof currentValue === "string" ? currentValue.length : 0)}
          </span>
        )}
        {currentValue && (
          <span
            onClick={clearValue}
            className={cn(
              "cursor-pointer p-1 size-6  rounded-full bg-black/20 flex items-center justify-center",
              isFocused && "rounded-l-2xl px-2 py-1 text-sm font-medium"
            )}
          >
            X
          </span>
        )}
      </div>
    </div>
  );
};

export default InputQuiz;
