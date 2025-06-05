import cn from "@/HOC/cn";
import { motion as m, type HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Define button variants
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "custom";

// Define styles for each variant
const variantStyles: Record<
  ButtonVariant,
  {
    classBg: string;
    classShadow: string;
    classText?: string;
  }
> = {
  primary: {
    classBg: "bg-blue-500",
    classShadow: "bg-blue-700",
    classText: "text-white",
  },
  secondary: {
    classBg: "bg-gray-200",
    classShadow: "bg-gray-400",
    classText: "text-gray-800",
  },
  danger: {
    classBg: "bg-red-500",
    classShadow: "bg-red-700",
    classText: "text-white",
  },
  success: {
    classBg: "bg-green-500",
    classShadow: "bg-green-700",
    classText: "text-white",
  },
  warning: {
    classBg: "bg-yellow-400",
    classShadow: "bg-yellow-600",
    classText: "text-gray-900",
  },
  info: {
    classBg: "bg-indigo-400",
    classShadow: "bg-indigo-600",
    classText: "text-white",
  },
  custom: {
    classBg: "bg-cam",
    classShadow: "bg-[#8aa45c]",
  },
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  /**
   * Button text or content
   */
  text: string | React.ReactNode;

  /**
   * Button style variant
   * @default "custom"
   */
  variant?: ButtonVariant;

  /**
   * Background color class for the button (overrides variant)
   */
  classBg?: string;

  /**
   * Class for the container wrapper
   */
  classContainer?: string;

  /**
   * Shadow color class for the button (overrides variant)
   */
  classShadow?: string;

  /**
   * Class for the text/content styling (overrides variant)
   */
  classText?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Class applied when button is disabled
   * @default "opacity-50 cursor-not-allowed"
   */
  disabledClass?: string;

  /**
   * Fixed width for the button (px)
   */
  width?: number;

  /**
   * Fixed height for the button (px)
   */
  height?: number;
  fullWidth?: boolean;
}

interface ButtonSize {
  width: number;
  height: number;
}

const Button = ({
  text,
  variant = "custom",
  classBg,
  classContainer,
  classShadow,
  classText,
  disabled = false,
  disabledClass = "opacity-50 cursor-not-allowed",
  width,
  height,
  fullWidth,
  ...props
}: ButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [buttonSize, setButtonSize] = useState<ButtonSize | null>(null);
  const textRef = useRef<HTMLButtonElement>(null);
  const hiddenTextRef = useRef<HTMLDivElement>(null);

  // Get styles from variant
  const variantStyle = variantStyles[variant];

  useEffect(() => {
    // Function to measure the button text
    const measureButton = () => {
      if (hiddenTextRef.current) {
        setButtonSize({
          width: width || hiddenTextRef.current.offsetWidth + 32, // Add padding
          height: height || hiddenTextRef.current.offsetHeight + 16, // Add padding
        });
      }
    };

    // Measure after render and when content might change
    measureButton();

    // Also measure on window resize
    window.addEventListener("resize", measureButton);

    return () => {
      window.removeEventListener("resize", measureButton);
    };
  }, [text, width, height]); // Re-measure when text changes or width/height props change

  // Use provided styles or fall back to variant styles
  const finalClassBg = classBg || variantStyle.classBg;
  const finalClassShadow = classShadow || variantStyle.classShadow;
  const finalClassText = classText || variantStyle.classText || "";

  const handleClick = (isLeave?: boolean) => {
    if (disabled) return;

    setIsClicked((prev) => !prev);
    if (isLeave) setIsClicked(false);
  };

  // Use inline styles for dynamic dimensions
  const containerStyle = fullWidth
    ? { width: "100%", height: buttonSize?.height || undefined }
    : buttonSize
    ? {
        width: `${buttonSize.width}px`,
        height: `${buttonSize.height}px`,
      }
    : undefined;

  return (
    <>
      {/* Hidden element to measure text size */}
      <div
        ref={hiddenTextRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          display: "inline-block",
          fontSize: "1rem", // Match text-base
          fontWeight: "bold", // Match font-bold
        }}
      >
        {typeof text === "string" ? text : "Button"}
      </div>

      <div
        style={containerStyle}
        className={cn(
          "relative group px-6 group/item cursor-pointer pointer-events-auto whitespace-nowrap text-base font-bold text-center duration-100 transition-all inline-block",
          classContainer,
          isClicked && !disabled ? "top-1" : "top-0",
          disabled && disabledClass
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-lg z-0",
            finalClassShadow,
            disabled && "opacity-50"
          )}
        ></div>
        <m.div
          className={cn(
            "opacity-70 rounded-lg z-1 absolute inset-x-0 bottom-[6px] group/item top-0 group-hover/item:opacity-100 duration-100 transition-all border",
            finalClassBg,
            isClicked && !disabled ? "bottom-[2px]" : "bottom-[6px]",
            disabled && "group-hover/item:opacity-70"
          )}
        ></m.div>
        <m.button
          ref={textRef}
          onMouseDown={() => handleClick()}
          onMouseUp={() => handleClick()}
          onMouseLeave={() => handleClick(true)}
          disabled={disabled}
          {...props}
          className={cn(
            "absolute inset-0 top-1 z-1 cursor-pointer duration-100 transition-all",
            finalClassText,
            isClicked && !disabled ? "top-2" : "top-0",
            disabled && "cursor-not-allowed"
          )}
        >
          {text}
        </m.button>
      </div>
    </>
  );
};

export default Button;
