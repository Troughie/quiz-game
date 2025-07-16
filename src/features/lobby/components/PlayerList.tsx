import Avatar from "@/components/ui/Avatar";
import type { Player } from "@/types/Index";
import { motion as m } from "framer-motion";

interface props {
    players: Player[];
    handleFunction: () => void;
}
export const PlayerList = ({ players, handleFunction }: props) => {
    if (!players?.length) {
        return (
            <div className="bg-white/10 rounded-lg p-8 text-center">
                <p className="text-white text-lg">
                    Waiting for players to join...
                </p>
                <button
                    className="text-white cursor-pointer"
                    onClick={() => handleFunction()}
                >
                    join this room
                </button>
                <p className="text-white/60 mt-2">
                    Share the PIN or QR code to invite players
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {players?.map((player) => (
                <m.div
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    key={player?.id}
                    className="bg-white/10 rounded-lg p-4 flex flex-col items-center gap-2"
                >
                    <Avatar player={player} />
                    <span className="text-white font-medium">
                        {player?.username}
                    </span>
                </m.div>
            ))}
        </div>
    );
};
