import React, { useEffect, useState } from "react";
import Button from "@/components/ui/ButtonCustom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CharacterSchema } from "@/schema/Charater";
import { usePlayerStore } from "@/store/Player";
import Input from "@/components/ui/InputBase";
import useDebounce from "@/hooks/useDebounce";
import type { Player } from "@/types/Index";

// Array of available avatars - you can extend this
const AVAILABLE_AVATARS = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
    // Add more avatar paths
];

const ChangePlayer = () => {
    const { player, updatePlayer } = usePlayerStore();
    const [currentAvatar, setCurrentAvatar] = useState(
        player?.avatar || AVAILABLE_AVATARS[0]
    );
    const [previousAvatar, setPreviousAvatar] = useState(
        player?.avatar || AVAILABLE_AVATARS[0]
    );

    const methods = useForm({
        mode: "onChange",
        resolver: yupResolver(CharacterSchema),
        defaultValues: {
            username_player: player?.username || "",
        },
    });

    const { watch } = methods;
    const username = watch("username_player");
    const debounceUserName = useDebounce<string>(username, 1000);
    const debounceAvatar = useDebounce<string>(currentAvatar, 1000);

    useEffect(() => {
        if (
            (debounceUserName && debounceUserName !== player.username) ||
            (debounceAvatar && debounceAvatar) !== player.avatar
        ) {
            const newPlayerState: Partial<Player> = {
                avatar: debounceAvatar || player.avatar,
                username: debounceUserName || player.username,
            };
            updatePlayer(newPlayerState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceUserName, debounceAvatar]);

    useEffect(() => {
        setPreviousAvatar(currentAvatar);
    }, [currentAvatar]);

    const handleRandomAvatar = () => {
        const currentIndex = AVAILABLE_AVATARS.indexOf(currentAvatar);
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * AVAILABLE_AVATARS.length);
        } while (newIndex === currentIndex);
        setCurrentAvatar(AVAILABLE_AVATARS[newIndex]);
    };

    const handlePreviousAvatar = () => {
        setCurrentAvatar(previousAvatar);
    };

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col min-h-[400px] w-full  bg-black/70 rounded-lg p-6 relative">
                {/* Centered Content */}
                <div className="grid place-items-center translate-x-1/4">
                    <Input name="username_player" className="max-w-1/2" />
                </div>
                <div className="flex flex-col justify-center items-center mt-4 gap-6 flex-grow">
                    <div className="relative">
                        <div className="size-40 rounded-full overflow-hidden bg-white/20">
                            <img
                                src={currentAvatar}
                                alt="Selected avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Avatar Control Buttons */}
                        <div className="flex gap-2 mt-4 justify-center">
                            <Button
                                text="Previous"
                                variant="secondary"
                                onClick={handlePreviousAvatar}
                                classContainer="w-24"
                            />
                            <Button
                                text="Random"
                                variant="primary"
                                onClick={handleRandomAvatar}
                                classContainer="w-24"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default ChangePlayer;
