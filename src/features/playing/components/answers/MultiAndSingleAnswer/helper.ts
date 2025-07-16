import cn from "@/HOC/cn";
import { socket, connect } from "@/socket/init.socket";

export const notifyAnimationDone = (phase: string) => {
  connect();
  if (!socket) {
    console.log("don't connect");

    return;
  }
  const roomId = sessionStorage.getItem("roomId");
  socket.emit("animation_done", { roomId, phase });
};

// Style helper functions
export function getButtonSlideStyles(
  baseStyles: string,
  showingCorrectAnswer: boolean,
  isAnswerCorrect: boolean,
  isSelected: boolean,
  isDimmed: boolean,
  disabled: boolean
): string {
  if (showingCorrectAnswer) {
    return cn(
      baseStyles,
      "pointer-events-none select-none cursor-default",
      isAnswerCorrect && "border-2 border-green-400 text-white font-bold",
      isSelected
        ? "bg-blue-600 text-white font-bold"
        : "bg-white/10 text-white",
      isDimmed && !isAnswerCorrect && " !opacity-40"
    );
  }
  return cn(
    baseStyles,
    isSelected ? "bg-blue-600 text-white font-bold" : "bg-white/10 text-white",
    isDimmed && "pointer-events-none select-none cursor-default opacity-40",
    disabled && "pointer-events-none select-none cursor-default"
  );
}

export function getCheckboxSlideStyles(
  baseStyles: string,
  showingCorrectAnswer: boolean,
  isAnswerCorrect: boolean,
  isSelected: boolean,
  disabled: boolean
): string {
  if (isSelected) {
    return cn(
      "border border-green-400/50 bg-green-100/10 text-white",
      baseStyles,
      isAnswerCorrect && showingCorrectAnswer && "bg-white/80 border text-black"
    );
  }

  if (isAnswerCorrect && showingCorrectAnswer) {
    return cn("bg-white/80 border text-black", baseStyles);
  }

  return cn(
    baseStyles,
    !isSelected && "bg-white/10 text-white",
    disabled && "pointer-events-none select-none cursor-default"
  );
}
