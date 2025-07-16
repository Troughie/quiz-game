import { useOutletContext } from "react-router-dom";
import type { LobbyLayoutContext } from "../type";

export const useLobbyLayoutContext = () => {
    return useOutletContext<LobbyLayoutContext>();
};
