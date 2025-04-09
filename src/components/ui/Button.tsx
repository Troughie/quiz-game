interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export const ButtonBase = ({
  children,
  className,
  variant = "primary",
  size = "medium",
  ...props
}: ButtonProps) => {
  const variantClass = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    outline: "border border-primary text-primary",
  };
  const sizeClass = {
    small: "text-sm px-4 py-2",
    medium: "text-base px-6 py-3",
    large: "text-lg px-8 py-4",
  };
  return (
    <button
      className={`${className} cursor-pointer hover:text-gray-300 transition-colors flex items-center gap-2 ${variantClass[variant]} ${sizeClass[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
