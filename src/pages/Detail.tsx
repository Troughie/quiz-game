import Button from "@/components/ui/ButtonCustom";
import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router";

const Detail = () => {
  const navigate = useNavigate();
  const { title } = useParams();
  return (
    <div className="flex flex-col gap-12">
      <div className="top-detail w-full h-auto grid grid-rows-3 lg:grid-rows-1 grid-cols-3 p-4 bg-black-10 rounded-lg">
        <div className="col-span-3 row-span-2 lg:col-span-1 lg:row-span-1 w-full h-full bg-red-500 rounded-lg"></div>
        <div className="col-span-3 mt-6 lg:col-span-2 lg:col-start-2 lg:pl-10 flex flex-col gap-2 justify-start">
          <div className="flex gap-2 items-center">
            <div className="rounded-full size-8 bg-red-500"></div>
            <span className="font-semibold text-lg">LinhLinh2</span>
          </div>
          <span className="text-3xl font-bold">{title}</span>
          <div className="flex gap-4 items-center font-bold text-lg">
            <div className="star flex gap-[1px] items-center text-yellow-500">
              <span className="font-semibold">5</span>{" "}
              <StarIcon className="w-4 h-4 " />
            </div>
            <span>12 question</span>
            <span>4 minutes duration</span>
            <span>English</span>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Button
              text="Play"
              classBg="bg-cam rounded-3xl"
              classContainer="md:px-8 py-6 h-10 w-1/5 md:w-2/3 text-black border-4 rounded-3xl"
              classShadow="bg-shadow rounded-3xl"
              classText=""
              onClick={() => {
                navigate(`/play/${title}`, { state: { isHost: true } });
              }}
            />
            <div className="size-10 rounded-full bg-blue-400"></div>
            <div className="size-10 rounded-full bg-blue-400"></div>
          </div>
          <div className="flex gap-4 items-center mt-2">
            <span className="cursor-pointer rounded-3xl px-4 bg-fff">test</span>
            <span className="cursor-pointer rounded-3xl px-4 bg-white">
              test
            </span>
            <span className="cursor-pointer rounded-3xl px-4 bg-white">
              test
            </span>
            <span className="cursor-pointer rounded-3xl px-4 bg-white">
              test
            </span>
          </div>
        </div>
      </div>
      <div className="min-h-screen">
        <div className="flex gap-4">
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
