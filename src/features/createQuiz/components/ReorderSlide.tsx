import Input from "@/components/ui/InputBase";
import React, { useEffect, useState } from "react";
import InputQuiz from "./ui/Input";
import { useQuizStore } from "../store/quizStore";
import type { Answer, Question } from "../type";
import type { slideProps } from "./ButtonSlide";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface props {
  id: number;
  children: React.ReactNode;
}
const SortableItem = ({ id, children }: props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 4,
    marginBottom: 8,
    borderRadius: 4,
  };

  return (
    <div
      ref={setNodeRef}
      className="flex items-center gap-4 w-full justify-center"
      style={style}
      {...attributes}
    >
      <div {...listeners} className="cursor-grab pr-2 text-white text-3xl">
        {id + 1}
      </div>
      <div className="flex-1 items-center mt-2 -mb-3">{children}</div>
    </div>
  );
};
const ReorderSlide = ({ handleAnswerChange, slide }: slideProps) => {
  const { currentSlideIndex, getSlide, editSlides } = useQuizStore();

  const [answers, setAnswers] = useState<Answer[]>([]);
  useEffect(() => {
    const currentSlide = getSlide();
    setAnswers(currentSlide?.answers || []);
  }, [getSlide, currentSlideIndex, editSlides, answers]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = getSlide()?.answers?.findIndex(
        (q, i) => i === active.id
      );
      const newIndex = getSlide()?.answers?.findIndex((q, i) => i === over.id);
      if (oldIndex && newIndex) {
        const newAnswers = arrayMove(answers, oldIndex, newIndex);
        const newSlide: Partial<Question> = {
          answers: newAnswers,
        };

        setAnswers(arrayMove(answers, oldIndex, newIndex));
        if (slide) {
          editSlides(newSlide, slide._id);
        }
      }
    }
  };
  return (
    <>
      <div className=" flex-col inline-flex relative bg-green-700  rounded-b-xl mt-4">
        <span className="bg-green-700 z-1 absolute -top-6 rounded-t-xl py-2 px-2 text-white font-medium">
          Items in correct order
        </span>
        <Input
          name="wrongAnswer"
          render={(field) => (
            <div className="flex  flex-col mt-8 relative gap-2">
              <DndContext
                onDragEnd={handleDragEnd}
                sensors={sensors}
                collisionDetection={closestCenter}
              >
                <SortableContext
                  items={answers.map((q, i) => i)}
                  strategy={verticalListSortingStrategy}
                >
                  {[0, 1, 2, 3].map((originalIndex, index) => {
                    return (
                      <SortableItem key={index} id={index}>
                        <div className="mb-2">
                          <InputQuiz
                            key={index}
                            {...field}
                            maxLength={120}
                            onChange={(e) =>
                              handleAnswerChange({
                                value: e.target.value,
                                mode: "answers",
                                index,
                                isCorrect: true,
                                slideIdProp: slide?._id || "",
                              })
                            }
                            value={slide?.answers?.[index]?.text}
                            row={1}
                            name={`wrongAnswers`} // Nếu bạn dùng react-hook-form
                            backgroundColor="bg-green-700"
                            borderColor="border-green-700 rounded-xl"
                            classNameContainer={`${index === 0 && "-mt-4"}`}
                          />
                        </div>
                      </SortableItem>
                    );
                  })}
                </SortableContext>
              </DndContext>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default ReorderSlide;
