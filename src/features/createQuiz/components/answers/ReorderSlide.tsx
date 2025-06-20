import Input from "@/components/ui/InputBase";
import React, { useEffect, useState } from "react";
import InputQuiz from "../ui/Input";
import { useQuizStore } from "../../store/quizStore";
import type { Answer, slideProps } from "../../type";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
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
  isDragging?: boolean;
}

const SortableItem = ({ id, children, isDragging = false }: props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isItemDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition || "transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    padding: 4,
    marginBottom: 8,
    borderRadius: 4,
    opacity: isItemDragging ? 0.5 : 1,
    zIndex: isItemDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center gap-4 w-full justify-center
        transition-all duration-200 ease-out
        ${
          isItemDragging
            ? "scale-105 shadow-2xl bg-green-600/20 backdrop-blur-sm"
            : "hover:scale-[1.02]"
        }
        ${isDragging && !isItemDragging ? "opacity-80" : ""}
      `}
      style={style}
      {...attributes}
    >
      <div
        {...listeners}
        className={`
          cursor-grab active:cursor-grabbing pr-2 text-white text-3xl font-bold
          transition-all duration-200 ease-out
          hover:scale-110 hover:text-green-200
          ${isItemDragging ? "animate-pulse" : ""}
          select-none
        `}
      >
        <div
          className={`
          w-8 h-8 rounded-full bg-green-600 flex items-center justify-center
          transition-all duration-200 ease-out
          ${isItemDragging ? "bg-green-400 shadow-lg" : "hover:bg-green-500"}
        `}
        >
          {id + 1}
        </div>
      </div>
      <div
        className={`
        flex-1 items-center mt-2 -mb-3
        transition-all duration-200 ease-out
        ${isItemDragging ? "transform scale-105" : ""}
      `}
      >
        {children}
      </div>
    </div>
  );
};

const ReorderSlide = ({ handleInputChange, slide }: slideProps) => {
  const { currentSlideIndex, selectedSlide } = useQuizStore();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    const currentSlide = selectedSlide;
    setAnswers(currentSlide?.answers || []);
  }, [selectedSlide, currentSlideIndex]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: { active: any }) => {
    const { active } = event;
    setActiveId(active.id);
    const draggedIndex = active.id;
    setDraggedItem(
      <div className="mb-2 transform scale-105 shadow-2xl">
        <InputQuiz
          maxLength={120}
          value={slide?.answers?.[draggedIndex]?.text || ""}
          row={1}
          name={`draggedAnswer`}
          backgroundColor="bg-green-600"
          borderColor="border-green-400 rounded-xl"
          readOnly
        />
      </div>
    );
  };

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedItem(null);

    if (active.id !== over?.id && over) {
      const oldIndex = active.id;
      const newIndex = over.id;

      if (oldIndex !== undefined && newIndex !== undefined) {
        const newAnswers = arrayMove(answers, oldIndex, newIndex);
        setAnswers(newAnswers);

        // Cập nhật store với thứ tự mới
        newAnswers.forEach((answer, index) => {
          handleInputChange({
            value: answer.text ?? "",
            mode: "answers",
            index,
            isCorrect: true,
          });
        });
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraggedItem(null);
  };

  return (
    <>
      <div className="flex-col inline-flex relative bg-green-700 rounded-b-xl mt-4 overflow-hidden">
        {/* Header với animation */}
        <div className="relative">
          <span
            className={`
            bg-green-700 z-10 absolute -top-6 rounded-t-xl py-2 px-4 text-white font-medium
            transition-all duration-300 ease-out
            hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5
          `}
          >
            Items in correct order
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 hover:opacity-100 rounded-t-xl transition-opacity duration-300 -z-10"></div>
          </span>
        </div>

        <Input
          name="wrongAnswer"
          render={(field) => (
            <div className="flex flex-col mt-8 relative gap-2 p-4">
              <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                sensors={sensors}
                collisionDetection={closestCenter}
              >
                <SortableContext
                  items={[0, 1, 2, 3]}
                  strategy={verticalListSortingStrategy}
                >
                  {[0, 1, 2, 3].map((index) => {
                    return (
                      <SortableItem
                        key={index}
                        id={index}
                        isDragging={activeId !== null}
                      >
                        <div className="mb-2">
                          <InputQuiz
                            {...field}
                            maxLength={120}
                            onChange={(e) =>
                              handleInputChange({
                                value: e.target.value,
                                mode: "answers",
                                index,
                                isCorrect: true,
                              })
                            }
                            value={slide?.answers?.[index]?.text}
                            row={1}
                            name={`wrongAnswers`}
                            backgroundColor="bg-green-700"
                            borderColor="border-green-700 rounded-xl"
                            classNameContainer={`${
                              index === 0 && "-mt-4"
                            } transition-all duration-200`}
                          />
                        </div>
                      </SortableItem>
                    );
                  })}
                </SortableContext>

                {/* Drag Overlay cho smooth animation */}
                <DragOverlay
                  adjustScale={false}
                  style={{
                    transformOrigin: "0 0",
                  }}
                >
                  {activeId !== null ? (
                    <div className="flex items-center gap-4 w-full justify-center opacity-95">
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold shadow-2xl animate-pulse">
                        {activeId + 1}
                      </div>
                      <div className="flex-1">{draggedItem}</div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

              {/* Subtle background animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-500/5 rounded-xl
                  transition-all duration-500 ease-out
                  ${
                    activeId !== null
                      ? "opacity-100 scale-105"
                      : "opacity-0 scale-100"
                  }
                `}
                ></div>
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default ReorderSlide;
