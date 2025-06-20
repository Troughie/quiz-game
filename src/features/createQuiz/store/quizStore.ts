import { create } from "zustand";
import type {
  ActionClient,
  Question,
  QuestionType,
  Quiz,
  quizType,
} from "../type";
import { persist } from "zustand/middleware";
import { applySlideAction, type UpdateAction } from "../utils";

interface QuizStore {
  quiz: Quiz;
  selectedSlide: Question | null;
  slides: Question[];
  currentSlideIndex: number;
  isUserTyping: boolean;
  typeQuiz: quizType;
  selectedSlideChanged: Partial<Question> | null;

  quizChanged: boolean;
  lastSavedAt?: number;
  action: ActionClient | null;

  setTypeQuiz: (type: quizType) => void;

  selectSlide: (slideIndex: number) => void;
  setCurrentSlideIndex: (index: number) => void;

  editSlide: (type: UpdateAction, slideIndex?: number | string) => void;
  editCurrentSlide: (type: UpdateAction) => void;

  addSlide: (slide: QuestionType) => void;
  addSlides: (slides: Question[]) => void;

  setIsUserTyping: (isUserTyping: boolean) => void;
  removeSlide: (slideId: string) => void;
  editQuiz: (quiz: Partial<Quiz>) => void;

  resetQuizChanged: () => void;
  markAsSaved: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      quiz: { _id: "", name: "", description: "", media: "", tags: [] },
      slides: [],
      currentSlideIndex: 0,
      isUserTyping: false,
      typeQuiz: "selectType",
      slideChanged: undefined,
      selectedSlide: null,
      selectedSlideChanged: null,
      quizChanged: false,
      action: null,

      setTypeQuiz: (type: quizType) => set(() => ({ typeQuiz: type })),

      editSlide: (type: UpdateAction, slideIndex?: number | string) =>
        set((state) => {
          const updatedSlides = state.slides.map((slide) => {
            const slideFounded =
              slide.index === slideIndex || slide._id === slideIndex;
            if (!slideFounded) return slide;

            const updatedSlide = applySlideAction(slide, type);

            return updatedSlide;
          });

          return {
            slides: updatedSlides,
          };
        }),

      editCurrentSlide: (type: UpdateAction) =>
        set((state) => {
          const currentSlide = state.selectedSlide;
          if (!currentSlide) return {};

          const updatedSlide = applySlideAction(currentSlide, type);

          return {
            selectedSlide: updatedSlide,
            selectedSlideChanged: updatedSlide,
            action: type.type,
          };
        }),

      markAsSaved: () =>
        set({
          selectedSlideChanged: null,
          lastSavedAt: Date.now(),
          action: null,
        }),
      setIsUserTyping: (isUserTyping: boolean) => set(() => ({ isUserTyping })),
      addSlides: (slides) =>
        set((state) => {
          const currentIndex = state.currentSlideIndex;
          return {
            slides,
            // Reset selection nếu slides mới
            selectedSlide: slides[currentIndex],
            currentSlideIndex: currentIndex,
          };
        }),

      addSlide: (slide: QuestionType) =>
        set((state) => ({
          slides: [...state.slides, slide],
          selectedSlide: slide,
          currentSlideIndex: slide.index,
        })),

      selectSlide: (slideIndex: number) =>
        set((state) => {
          if (slideIndex < 0 || slideIndex >= state.slides.length) {
            console.warn(`Invalid slide index: ${slideIndex}`);
            return {};
          }

          return {
            currentSlideIndex: slideIndex,
            selectedSlide: state.slides[slideIndex],
          };
        }),

      removeSlide: (slideId: string) =>
        set((state) => {
          const Slides = [...state.slides];
          const updateSlide = Slides.filter((sl) => sl._id !== slideId);
          return { slides: updateSlide };
        }),
      setCurrentSlideIndex: (index: number) =>
        set(() => ({ currentSlideIndex: index })),
      resetQuizChanged: () => set(() => ({ quizChanged: false })),
      editQuiz: (quiz: Partial<Quiz>) =>
        set((state) => ({
          quiz: { ...state.quiz, ...quiz },
          quizChanged: true,
        })),
      reset: () =>
        set(() => ({
          quiz: { _id: "", name: "", description: "", media: "", tags: [] },
          slides: [],
          currentSlideIndex: 0,
        })),
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        quiz: state.quiz,
        slides: state.slides,
        currentSlideIndex: state.currentSlideIndex,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
