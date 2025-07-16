import type { AnimationControls } from "framer-motion";
import { useEffect } from "react";
import type { AnimationState } from "../../../../constant";

export function useAnimationEffects({
  isPause,
  controls,
  indicatorControls,
  animationState,
  shouldShowIndicator,
  index,
  isAnswerCorrect,
  isSelected,
}: {
  isPause: boolean;
  controls: AnimationControls;
  indicatorControls: AnimationControls;
  animationState: AnimationState;
  shouldShowIndicator: boolean;
  index: number;
  isAnswerCorrect: boolean;
  isSelected: boolean;
}) {
  // Main animation control effect
  useEffect(() => {
    if (isPause) {
      controls.stop();
      indicatorControls.stop();
    } else {
      controls.start(animationState);

      if (shouldShowIndicator) {
        console.log(
          `Starting indicator animation for answer ${index}, isCorrect: ${isAnswerCorrect}, isSelected: ${isSelected}`
        );
        indicatorControls.start({ scale: 1 });
      }
    }
  }, [
    isPause,
    animationState,
    shouldShowIndicator,
    controls,
    indicatorControls,
    index,
    isAnswerCorrect,
    isSelected,
  ]);

  // Indicator animation effect
  useEffect(() => {
    if (!isPause && shouldShowIndicator) {
      indicatorControls.start({ scale: 1 });
    }
  }, [
    shouldShowIndicator,
    isPause,
    indicatorControls,
    index,
    isAnswerCorrect,
    isSelected,
  ]);
}
