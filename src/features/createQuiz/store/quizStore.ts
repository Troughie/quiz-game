import { create } from "zustand";
import type { Question, QuestionType, Quiz, quizType } from "../type";
import { createJSONStorage, persist } from "zustand/middleware";

interface QuizStore {
  quiz: Quiz;
  quizCurrent: Quiz;
  slides: Question[];
  currentSlideIndex: number;
  slideChanged: Partial<Question> | undefined;
  isChanged: boolean;
  slideId?: string;
  indexAnswer?: number;
  typeQuiz?: quizType;
  editQuizCurrent: (quiz: Partial<Quiz>) => void;
  setTypeQuiz: (type: quizType) => void;
  setIndexAnswer: (indexAnswer?: number) => void;
  setSlideId: (slideId?: string) => void;
  setIsChanged: (isChanged: boolean) => void;
  addSlides: (slides: Question[]) => void;
  getSlide: () => Question;
  addSlide: (slide: QuestionType) => void;
  removeSlide: (slideId: string) => void;
  editQuiz: (quiz: Partial<Quiz>) => void;
  editSlides: (slide: Partial<Question>, slideId?: string | number) => void;
  setSlideChanged: (slides?: Partial<Question>) => void;
  setCurrentSlideIndex: (index: number) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      quiz: { _id: "", name: "", description: "", media: "", tags: [] },
      quizCurrent: { _id: "", name: "", description: "", media: "", tags: [] },
      slides: [],
      currentSlideIndex: 0,
      isChanged: false,
      indexAnswer: undefined,
      typeQuiz: undefined,
      slideChanged: undefined,
      slideId: undefined,
      setTypeQuiz: (type: quizType) => set(() => ({ typeQuiz: type })),
      setIndexAnswer: (indexAnswer?: number) => set(() => ({ indexAnswer })),
      setIsChanged: (isChanged: boolean) => set(() => ({ isChanged })),
      addSlides: (slides: Question[]) => set(() => ({ slides })),
      setSlideId: (slideId?: string) => set(() => ({ slideId })),
      setSlideChanged: (slides?: Partial<Question>) =>
        set((state) => {
          if (slides === undefined) {
            return { slideChanged: undefined };
          }
          return {
            slideChanged: {
              ...state.slideChanged,
              ...slides,
            },
          };
        }),
      getSlide: () => {
        const state = get();
        const currentSlide = state.slides[state.currentSlideIndex];
        if (!currentSlide) return {} as Question;
        return { ...currentSlide };
      },
      addSlide: (slide: QuestionType) =>
        set((state) => ({ slides: [...state.slides, slide] })),
      removeSlide: (slideId: string) =>
        set((state) => {
          const Slides = [...state.slides];
          const updateSlide = Slides.filter((sl) => sl._id !== slideId);
          return { slides: updateSlide };
        }),
      setCurrentSlideIndex: (index: number) =>
        set(() => ({ currentSlideIndex: index })),
      editQuiz: (quiz: Partial<Quiz>) =>
        set((state) => ({
          quiz: { ...state.quiz, ...quiz },
        })),
      editQuizCurrent: (quiz: Partial<Quiz>) =>
        set((state) => ({
          quizCurrent: { ...state.quiz, ...quiz },
        })),
      editSlides: (updatedData: Partial<Question>, slideId?: string | number) =>
        set((state) => {
          const updatedSlides = state.slides.map((slide) => {
            const isMatched =
              (typeof slideId === "string" && slide._id === slideId) ||
              (typeof slideId === "number" && slide.index === slideId);

            if (!isMatched) return slide;

            const updatedSlide = {
              ...slide,
              ...updatedData,
            };

            if (updatedData.answers && Array.isArray(updatedData.answers)) {
              updatedSlide.answers = updatedData.answers.map((ans, i) => {
                if (!ans)
                  return slide.answers?.[i] || { text: "", isCorrect: false };
                return { ...slide.answers?.[i], ...ans };
              });
            }

            return updatedSlide;
          });

          return {
            slides: [...updatedSlides],
          };
        }),

      reset: () =>
        set(() => ({
          quiz: { _id: "", name: "", description: "", media: "", tags: [] },
          slides: [],
          currentSlideIndex: 0,
        })),
    }),
    {
      name: "quiz-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        quizCurrent: state.quizCurrent,
      }),
    }
  )
);
