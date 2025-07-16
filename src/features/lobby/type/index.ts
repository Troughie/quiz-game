import type { Player, Room } from "@/types/Index";

export interface isHostCheck {
    isHost: boolean;
    player: Player;
}

export enum LeaveRoomAction {
    DESTROY = "destroy",
    KEEP = "keep",
}

export interface LobbyLayoutContext {
    room?: Partial<Room>;
    isHost: boolean;
}
