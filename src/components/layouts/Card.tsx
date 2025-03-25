import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Button from "../ui/ButtonBase";
import { Link, useNavigate } from "react-router";
interface props {
  title: string;
  author: string;
  rating: number;
  image: string;
}

const Card = React.forwardRef<HTMLDivElement, props>(({ title }, ref) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${title}`);
  };
  return (
    <div
      ref={ref}
      data-last="false"
      className="sm:pr-4 sm:w-1/4 h-full md:w-1/4 lg:w-1/5 xl:w-1/6 relative gap-2 flex flex-col flex-shrink-0 w-1/3 pr-2"
    >
      <div className="w-full h-2/3 group relative rounded-lg bg-red-500">
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        <div className="hidden group-hover:flex items-center justify-center h-full ">
          <Button
            text="Play"
            classBg="bg-cam rounded-3xl"
            classContainer="md:px-8 md:block hidden h-10 w-2/3 border-3 rounded-3xl"
            classShadow="bg-shadow rounded-3xl"
            classText="text-white"
            clickFunc={handleClick}
          />
        </div>
      </div>
      <Link
        to={`/${title}`}
        className="text-lg font-bold hover:underline cursor-pointer transition-all duration-300 hover:scale-90"
      >
        {title}
      </Link>
      <div className="flex gap-2">
        <div className="star flex gap-[1px] items-center text-yellow-500">
          <span className="font-semibold">5</span>{" "}
          <StarIcon className="w-4 h-4 " />
        </div>
        <div className="by group flex gap-1 items-center cursor-pointer">
          <span className="group-hover:underline">By</span>
          <span className="group-hover:underline">John Doe</span>
        </div>
      </div>
    </div>
  );
});

export default Card;
