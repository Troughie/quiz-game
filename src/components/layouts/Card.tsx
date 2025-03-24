import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Button from "../ui/ButtonBase";
interface props {
  title: string;
}
const Card = ({ title }: props) => {
  return (
    <div
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
            clickFunc={() => {}}
          />
        </div>
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="flex gap-2">
        <div className="star flex gap-1 items-center">
          <span>5</span> <StarIcon className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="by">
          <span>By</span>
          <span>John Doe</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
