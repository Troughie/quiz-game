import Button from "@/components/ui/ButtonCustom";
import { useAnimatedDots } from "@/utils";

interface props {
  isHost: boolean;
  onClickStart: () => void;
}
export const GameControlButton = ({ isHost, onClickStart }: props) => {
  const dots = useAnimatedDots();

  if (isHost) {
    return (
      <Button
        text={`Start Game`}
        classContainer="text-black w-2/3 flex md:px-8 h-10 min-w-[100px] border-3 rounded-3xl"
        classShadow="bg-shadow rounded-3xl"
        classBg="bg-cam rounded-3xl"
        onClick={onClickStart}
      />
    );
  }

  return (
    <Button
      disabled
      classText="cursor-default"
      text={`Waiting for host start ${dots}`}
      classContainer="text-white cursor-default w-2/3 flex md:px-8 h-10 min-w-[100px] border-3 rounded-3xl"
      classShadow="bg-brown-400 rounded-3xl"
      classBg="rounded-3xl bg-black/20"
    />
  );
};
