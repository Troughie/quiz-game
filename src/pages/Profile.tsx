import Setting from "@/features/profile/component/Setting";
import cn from "@/HOC/cn";
import React, { useState } from "react";
import { motion as m } from "framer-motion";
import MyQuizzes from "@/features/profile/component/MyQuizzes";
import { usePlayerStore } from "@/store/Player";
const typeButtonProfile = [
    {
        text: "My quizzes",
        type: "quiz",
    },
    {
        text: "Settings",
        type: "setting",
    },
];
const Profile = () => {
    const [typeProfile, setTypeProfile] = useState<string>(
        typeButtonProfile[0].type
    );
    const player = usePlayerStore((state) => state.player);

    const UIProfileNested = () => {
        return typeProfile === "setting" ? <Setting /> : <MyQuizzes />;
    };
    return (
        <div className="flex flex-col gap-8">
            <div className="border-y py-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-full size-10 border bg-white" />
                    <span className="text-4xl font-bold">
                        {player.username ?? ""}
                    </span>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-lg">
                    {typeButtonProfile.map(({ text, type }) => {
                        const isActive = type === typeProfile;
                        return (
                            <div key={type} className="relative ">
                                {isActive && (
                                    <m.div
                                        layoutId="bg"
                                        className="absolute inset-0 bg-black/90 rounded-2xl z-0"
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                <button
                                    onClick={() => setTypeProfile(type)}
                                    className={cn(
                                        "relative z-10 px-4 py-2 cursor-pointer rounded-2xl transition-colors duration-200",
                                        isActive ? "text-white" : "text-black"
                                    )}
                                >
                                    {text}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className=" bg-gray-200 h-screen p-6 rounded-lg">
                {UIProfileNested()}
            </div>
        </div>
    );
};

export default Profile;
