// Game timing constants
export const TIMING = {
  START_GAME_ANIM: 3000, // Animation bắt đầu trò chơi
  PRE_QUESTION_ANIM: 2000, // Animation trước câu hỏi
  QUESTION_DURATION: 15000, // Thời gian trả lời câu hỏi
  SHOW_ANSWER_ANIM: 2000, // Animation hiển thị đáp án
  FUNFACT_DURATION: 4000, // Thời gian hiển thị funfact
  SCOREBOARD_DURATION: 5000, // Thời gian hiển thị bảng điểm
};
export const TIME_SHOW_QUESTION = 4000;

// Animation configuration
export const ANIMATION_CONFIG = {
  duration: 0.2,
  baseDelay: 0.5,
  indexDelay: 0.1,
  springDuration: 0.4,
  notificationDelay: 500,
} as const;

// Question types enum for better type safety
export const QUESTION_TYPES = {
  BUTTON_SLIDE: "buttonSlide",
  CHECKBOX_SLIDE: "checkBoxSlide",
  FILL_BLANK: "fillBlank",
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

// Animation state enum
export const ANIMATION_STATES = {
  INITIAL: "initial",
  ANIMATE: "animate",
  UNSELECTED: "unselected",
  FINISHED: "finished",
} as const;

export type AnimationState =
  (typeof ANIMATION_STATES)[keyof typeof ANIMATION_STATES];

export const SCORE = {
  MAX: 1000,
  MIN: 400,
};
