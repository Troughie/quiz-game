import { usePlayingStore } from "@/features/playing/store/playingStore";
import cn from "@/HOC/cn";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion as m } from "framer-motion";

interface props {
    handleAnswerSubmit: (text: string) => void;
    isCorrectAnswerFillBlank?: boolean;
    showingCorrectAnswer?: boolean;
    correctText?: string;
    textPlayerAnswer: string[];
}

const FillBlank = ({
    handleAnswerSubmit,
    isCorrectAnswerFillBlank,
    showingCorrectAnswer,
    correctText,
    textPlayerAnswer,
}: props) => {
    const [textAnswer, setTextAnswer] = useState("");
    const { resetStateFillBlank } = usePlayingStore();
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && textAnswer.trim()) {
            handleAnswerSubmit(textAnswer.trim());
            setHasSubmitted(true);
        }
    };

    const HandleStateCorrectAnswer = useCallback(() => {
        if (
            hasSubmitted &&
            (!showingCorrectAnswer || isCorrectAnswerFillBlank)
        ) {
            return (
                <span
                    className={`text-lg font-semibold ${
                        isCorrectAnswerFillBlank
                            ? "text-outline-black"
                            : "text-red-500"
                    }`}
                >
                    {isCorrectAnswerFillBlank ? "Correct" : "Not correct"}
                </span>
            );
        }
    }, [hasSubmitted, isCorrectAnswerFillBlank, showingCorrectAnswer]);

    useEffect(() => {
        if (showingCorrectAnswer && correctText) {
            setTextAnswer(correctText);
        }
    }, [showingCorrectAnswer, correctText]);

    const isDisable = useMemo(
        () =>
            (hasSubmitted && isCorrectAnswerFillBlank) || showingCorrectAnswer,
        [hasSubmitted, isCorrectAnswerFillBlank, showingCorrectAnswer]
    );

    const handleDeleteTextAnswer = () => {
        if (isDisable) return;
        setTextAnswer("");
    };

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        resetStateFillBlank();
        setTextAnswer(e.target.value);
        setHasSubmitted(false);
    };

    return (
        <div className="flex flex-col gap-2 items-center">
            <div className="relative">
                <m.input
                    initial={{ scale: 0, translateX: -1 }}
                    animate={{ scale: 1, translateX: 0 }}
                    transition={{
                        duration: 0.3,
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                    type="text"
                    value={textAnswer}
                    onChange={handleChangeInput}
                    onKeyDown={handleKeyDown}
                    disabled={isDisable}
                    className={cn(
                        "p-6 text-center rounded-2xl text-xl font-bold  bg-white/80",
                        !hasSubmitted &&
                            "border-2 border-emerald-400/60 focus:border-emerald-500 shadow-lg focus:shadow-xl hover:shadow-md hover:ring-2 hover:ring-blue-600",
                        isDisable && "opacity-60"
                    )}
                />
                {!isCorrectAnswerFillBlank && textAnswer && (
                    <span
                        onClick={handleDeleteTextAnswer}
                        className={cn(
                            "absolute right-2 top-7 rounded-full p-1 size-6 flex items-center justify-center cursor-pointer bg-black/10 text-sm font-bold",
                            isDisable &&
                                "pointer-events-none select-none cursor-default"
                        )}
                    >
                        X
                    </span>
                )}
            </div>
            {<HandleStateCorrectAnswer />}
            {textPlayerAnswer.length > 0 &&
                textPlayerAnswer.map((e, i) => (
                    <>
                        <span key={i}>{e}</span>
                    </>
                ))}
        </div>
    );
};

export default FillBlank;
