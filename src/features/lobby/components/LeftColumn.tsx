import { ButtonBase } from "@/components/ui/Button";
import { NAME_SHOW } from "@/constant";
import { useShowFunction } from "@/store/ShowFunction";
import type { Room } from "@/types/Index";
import {
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import React, { useCallback } from "react";
interface props {
  room?: Room | Partial<Room>;
}
const LeftColumn = ({ room }: props) => {
  const { isBoolean, setIsBoolean } = useShowFunction();

  const handleHidden = useCallback(() => {
    if (isBoolean[NAME_SHOW.HIDDEN_PIN]) {
      return (
        <>
          <EyeIcon className="w-4 h-4" /> show
        </>
      );
    } else {
      return (
        <>
          <EyeSlashIcon className="w-4 h-4" /> hide
        </>
      );
    }
  }, [isBoolean]);

  const handleCopyPin = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.id || "");
    setIsBoolean(NAME_SHOW.COPY, !isBoolean[NAME_SHOW.COPY]);
    setTimeout(
      () => setIsBoolean(NAME_SHOW.COPY, isBoolean[NAME_SHOW.COPY]),
      2000
    );
  };
  return (
    <div className="space-y-6">
      <div className="space-y-6 py-2">
        <div className="flex justify-between items-center">
          <label className="text-white text-sm font-medium">Room PIN</label>
          <div className="flex">
            <ButtonBase
              onClick={handleCopyPin}
              className="text-white"
              variant="secondary"
              size="small"
            >
              <ClipboardIcon className="w-4 h-4" />
              {isBoolean[NAME_SHOW.COPY] ? "Copied!" : "Copy"}
            </ButtonBase>
            <ButtonBase
              onClick={() =>
                setIsBoolean(
                  NAME_SHOW.HIDDEN_PIN,
                  !isBoolean[NAME_SHOW.HIDDEN_PIN]
                )
              }
              className="text-white"
              variant="secondary"
              size="small"
            >
              {handleHidden()}
            </ButtonBase>
          </div>
        </div>
        <div
          onClick={handleCopyPin}
          className="bg-white/10 cursor-pointer text-white text-center text-4xl font-bold p-6 rounded-lg border border-white/20"
        >
          {isBoolean[NAME_SHOW.HIDDEN_PIN] ? "••••••" : room?.id}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg relative">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/join/${room?.id}`}
          alt="QR Code"
          className={`w-full transition-all duration-300 ${
            isBoolean[NAME_SHOW.HIDDEN_PIN] ? "blur-sm" : ""
          }`}
        />
        {isBoolean[NAME_SHOW.HIDDEN_PIN] && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white font-medium">QR Code Hidden</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftColumn;
