import React from "react";
import Button from "./ui/ButtonCustom";

interface props {
    mediaUrl: string;
    name: string;
    textButton: string;
    handleClickButton: () => void;
}
const QuizThumbnail = ({
    handleClickButton,
    mediaUrl,
    name,
    textButton,
}: props) => {
    return (
        <div className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px] rounded-lg overflow-hidden group bg-gray-200">
            <img
                src={mediaUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                    text={textButton}
                    classBg="bg-cam rounded-3xl"
                    classContainer="px-3 py-1.5 sm:px-4 sm:py-2 rounded-3xl border-3"
                    classShadow="bg-shadow rounded-3xl"
                    classText="text-white text-xs sm:text-sm"
                    onClick={handleClickButton}
                />
            </div>
        </div>
    );
};

export default QuizThumbnail;
