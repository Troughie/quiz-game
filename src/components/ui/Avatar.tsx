import type { Player } from "@/types/Index";

interface props {
    player: Player;
}
const Avatar = ({ player }: props) => {
    return (
        <div className="size-16 rounded-full bg-white/20 flex items-center justify-center">
            {player?.avatar ? (
                <img
                    src={player?.avatar}
                    alt={player?.username}
                    className="size-full rounded-full"
                />
            ) : (
                <span className="text-white text-2xl">
                    {player?.username?.[0]}
                </span>
            )}
        </div>
    );
};

export default Avatar;
