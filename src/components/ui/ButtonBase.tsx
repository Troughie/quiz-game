import cn from "@/HOC/cn";

interface props {
  text: string;
  classBg: string;
  classContainer: string;
  classShadow: string;
  classText: string;
  clickFunc: () => void;
}

const Button = ({
  text,
  classBg,
  classContainer,
  classShadow,
  classText,
  clickFunc,
}: props) => {
  return (
    <>
      <div
        className={cn(
          "relative group group/item cursor-pointer pointer-events-auto whitespace-nowrap text-base font-bold text-center",
          classContainer
        )}
      >
        <div
          className={cn(
            "bg-[#8aa45c] absolute inset-0 rounded-lg z-0",
            classShadow
          )}
        ></div>
        <div
          className={cn(
            "bg-cam opacity-70 rounded-lg z-1 absolute inset-x-0 bottom-1 group/item top-0 group-hover/item:opacity-100",
            classBg
          )}
        ></div>
        <button
          onClick={clickFunc}
          className={cn("absolute inset-0 top-1 z-1 cursor-pointer", classText)}
        >
          {text}
        </button>
      </div>
    </>
  );
};

export default Button;
