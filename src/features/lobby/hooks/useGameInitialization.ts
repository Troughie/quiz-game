import { usePath } from "@/hooks/usePath";
import { usePlayerStore } from "@/store/Player";
import { useEffect, useMemo } from "react";
import useLobby from "./useLobby";
import type { Room } from "@/types/Index";

interface props {
    room?: Partial<Room>;
}
export const useGameInitialization = ({ room }: props) => {
    const { pathname } = usePath();
    const { player } = usePlayerStore();
    const { createJoinOrReconnect } = useLobby();

    // ✅ Tính isHost động
    const isHost = useMemo(() => {
        return pathname.includes("play") || room?.host?.id === player.id;
    }, [pathname, player.id, room?.host?.id]);

    // Initialize game connection - chỉ chạy một lần
    useEffect(() => {
        (async () => {
            try {
                const updateRoom = await createJoinOrReconnect({
                    isHost,
                    player,
                });

                if (updateRoom) {
                    sessionStorage.setItem("roomId", updateRoom.id);
                }
            } catch (error) {
                console.error("Failed to initialize game:", error);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player, isHost]);

    return { isHost };
};
