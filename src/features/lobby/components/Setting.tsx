import { NAME_SHOW } from "@/constant";
import { useShowFunction } from "@/store/ShowFunction";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

export const Setting = () => {
  const { isBoolean, setIsBoolean } = useShowFunction();

  return (
    <div className="bg-white/10 rounded-lg p-6 my-4">
      <h3 className="text-white font-medium mb-4">Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white">Sound Effects</span>
          <button
            onClick={() =>
              setIsBoolean(NAME_SHOW.MUTE, !isBoolean[NAME_SHOW.MUTE])
            }
            className="text-white hover:text-gray-300 transition-colors"
          >
            {isBoolean[NAME_SHOW.MUTE] ? (
              <SpeakerXMarkIcon className="w-6 h-6" />
            ) : (
              <SpeakerWaveIcon className="w-6 h-6" />
            )}
          </button>
        </div>
        {/* Add more settings here */}
      </div>
    </div>
  );
};
