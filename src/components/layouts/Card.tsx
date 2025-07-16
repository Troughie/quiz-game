import React, { useMemo } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router";
import { usePlayerStore } from "@/store/Player";
import { useQuizStore } from "@/features/createQuiz/store/quizStore";
import type { Player } from "@/types/Index";
import type { Quiz } from "@/features/createQuiz/type";
import QuizThumbnail from "../QuizThumbnail";

interface CardProps extends Quiz {
    _id: string;
    media: string;
    name: string;
    author: Player;
}
const Card = React.forwardRef<object, CardProps>((data) => {
    const { _id, author, media, name } = data;
    const { reset, editQuiz } = useQuizStore();
    const player = usePlayerStore((state) => state.player);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/play/${_id}`);
    };

    const mediaUrl = useMemo(() => {
        if (media)
            return import.meta.env.VITE_SERVER_URL + `/files/${media}/view`;
    }, [media]);

    const handleEditQuiz = () => {
        reset();
        navigate(`/edit/${_id}`);
        editQuiz(data);
    };

    return (
        <div className="w-full sm:w-[220px] md:w-[240px] lg:w-[220px] xl:w-[250px] flex-shrink-0 flex flex-col gap-2 rounded-lg">
            {/* IMAGE BLOCK */}
            <QuizThumbnail
                mediaUrl={mediaUrl ?? ""}
                handleClickButton={handleClick}
                textButton="Play"
                name={name}
            />

            {/* TITLE */}
            <Link
                to={`/detail/${_id}`}
                className="text-sm sm:text-base font-semibold hover:underline cursor-pointer line-clamp-2"
            >
                {name || "No name"}
            </Link>

            {/* RATING + AUTHOR */}
            {author._id !== player._id ? (
                <div className="flex flex-col justify-start text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <span className="font-medium">5</span>
                        <StarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-gray-500 hover:text-black   hover:underline cursor-pointer truncate">
                        {author.username}
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleEditQuiz}
                    className="text-sm sm:text-base font-semibold hover:underline cursor-pointer"
                >
                    Edit
                </div>
            )}
        </div>
    );
});

export default Card;
