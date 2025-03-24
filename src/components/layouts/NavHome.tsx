import React from "react";

interface NavHomeProps {
  link: string;
  img: string;
  title: string;
  description: string;
}
const NavHomeItems: NavHomeProps[] = [
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Start",
    description: "Start",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Art &amp; Literature",
    description: "Art &amp; Literature",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Entertainment",
    description: "Entertainment",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Geography",
    description: "Geography",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "History",
    description: "History",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Languages",
    description: "Languages",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Science &amp; Nature",
    description: "Science &amp; Nature",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Sports",
    description: "Sports",
  },
  {
    link: "/",
    img: "/images/icons/navigation/start.svg",
    title: "Trivia",
    description: "Trivia",
  },
];
const NavHome = () => {
  return (
    <div className="relative md:py-4 md:block hidden">
      <div className="md:relative bg-theme md:bg-transparent md:rounded-none md:p-0 rounded-2xl top-4 md:top-0 absolute z-10 flex w-full p-4">
        <div className="md:pb-0 relative flex flex-col items-center w-full pb-4">
          {/* <div className="md:hidden flex flex-col items-center w-full pt-4">
            <a className="relative flex group text-black touch-manipulation cursor-pointer pointer-events-auto whitespace-nowrap md:px-8 h-10 px-6 py-0 text-base font-bold">
              <div className="-inset-1 absolute z-0"></div>
              <div className="absolute inset-x-0 top-0 bottom-0 transform group-active:translate-y-0.5 group-active:bottom-0.5 z-1 bg-black">
                <div className="relative w-full h-full">
                  <div className="top-1 absolute inset-x-0 bottom-0 overflow-hidden">
                    <div className="bg-opacity-30 absolute inset-0 bg-black"></div>
                  </div>
                  <div className="bottom-1 absolute inset-x-0 top-0 overflow-hidden group-active:bottom-0.5">
                    <div className="group-hover:bg-opacity-20 bg-fff absolute inset-0 bg-opacity-0"></div>
                  </div>
                </div>
              </div>
              <div className="z-1 absolute inset-0 overflow-hidden hidden">
                <div className="bg-opacity-20 absolute top-0 left-0 w-full h-full bg-black"></div>
              </div>
              <div className="relative flex flex-row gap-x-4 items-center w-full min-h-full pointer-events-none z-2 transform -translate-y-0.5 group-active:translate-y-0">
                <div className="flex flex-col flex-1 items-center">
                  <div className="relative">
                    <div className="relative">Create new quiz</div>
                  </div>
                </div>
              </div>
            </a>
            <div className="w-full h-[1px] bg-black bg-opacity-20 my-8"></div>
          </div> */}
          <div className="md:flex-row md:space-y-0 flex flex-col justify-between w-full space-y-2 font-sans text-base text-left text-black">
            {NavHomeItems.map(({ link, img, title }) => (
              <a
                className="whitespace-nowrap group font-roboto md:flex-col md:space-x-0 flex flex-row items-center space-x-3"
                href={link}
              >
                <img
                  src={img}
                  alt={title}
                  draggable="false"
                  className="md:w-9 md:h-9 w-5 h-5"
                />
                <div className="pb-1 md:text-xs text-base font-bold leading-snug transition-opacity group-hover:opacity-100 opacity-100">
                  {title}
                </div>
                <div className="w-full group-hover:opacity-100 opacity-0 transition-opacity h-1 bg-black rounded-full hidden md:block "></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavHome;
