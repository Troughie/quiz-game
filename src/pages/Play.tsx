import Button from "@/components/ui/ButtonBase";
import React from "react";

const Play = () => {
  return (
    <div>
      <nav></nav>
      <div className="h-screen w-screen">
        <div className="container mx-auto flex gap-8 my-10 w-full flex-wrap sm:flex-nowrap h-full items-center justify-center">
          <div className="rounded-2xl bg-petrol w-full h-2/3  ">
            <div className="flex justify-between gap-6 pt-16 pb-8 bg-black/60 rounded-t-2xl">
              <div className="size-20"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-white text-2xl font-bold">PIN code</span>
                <span className="text-white text-5xl font-bold">382710</span>
                <div className="flex gap-4 mt-6">
                  <span className="cursor-pointer text-white text-sm font-bold">
                    Copy
                  </span>
                  <span className="cursor-pointer text-white text-sm font-bold">
                    Hide
                  </span>
                </div>
              </div>
              <div className="size-20"></div>
            </div>
            <div className="p-6 flex flex-col h-full gap-4 justify-center items-center">
              <span>Waiting people connect...</span>
              <span>Join with this device</span>
              <Button
                text="Start now"
                classBg="bg-cam rounded-3xl"
                classContainer="md:px-8 mt-16 py-6 h-10 w-1/5 md:w-2/3 text-black border-4 rounded-3xl"
                classShadow="bg-shadow rounded-3xl"
                classText=""
                clickFunc={() => {}}
              />
            </div>
          </div>
          <div className="rounded-2xl w-full h-2/3 flex-1/2 bg-petrol">hi</div>
        </div>
      </div>
    </div>
  );
};

export default Play;
