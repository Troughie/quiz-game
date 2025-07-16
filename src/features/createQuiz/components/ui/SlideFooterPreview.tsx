import cn from "@/HOC/cn";
import { useMemo } from "react";

interface props {
    question: string;
    index: number;
    img?: string;
    isActive?: boolean;
    onClick?: () => void;
}
const SlideFooterPreview = ({
    onClick,
    isActive,
    img,
    index,
    question,
}: props) => {
    const mediaUrl = useMemo(() => {
        if (img) return import.meta.env.VITE_SERVER_URL + `/files/${img}/view`;
    }, [img]);

    return (
        <>
            <li
                onClick={onClick}
                className={cn(
                    "rounded-lg w-20 h-14 bg-black/30 relative cursor-pointer hover:scale-110 duration-300 transition-all ease-in-out",
                    isActive && "border border-white "
                )}
            >
                <div className=" absolute flex flex-col items-center gap-1 top-2 left-1/2 -translate-x-1/2 w-full">
                    <img src={mediaUrl} alt="#" className="size-8 bg-black" />
                    <span className="text-white text-[6px] text-center w-2/3 text-nowrap text-ellipsis overflow-hidden">
                        {question}
                    </span>
                </div>
                <span className="absolute top-0 left-0 text-white text-[8px] z-10">
                    {index}
                </span>
            </li>
        </>
    );
};

export default SlideFooterPreview;
