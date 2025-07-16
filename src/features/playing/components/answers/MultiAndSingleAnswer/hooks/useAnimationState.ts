import { useMemo } from "react";
import { ANIMATION_STATES, type AnimationState } from "../../../../constant";

export function useAnimationState(
  showingCorrectAnswer: boolean,
  isDimmed: boolean
): AnimationState {
  return useMemo(() => {
    if (showingCorrectAnswer) {
      return ANIMATION_STATES.FINISHED;
    }
    return isDimmed ? ANIMATION_STATES.UNSELECTED : ANIMATION_STATES.ANIMATE;
  }, [showingCorrectAnswer, isDimmed]);
}
