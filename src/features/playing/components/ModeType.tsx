import cn from "@/HOC/cn";
import { ItemsType } from "@/utils";
import { useState } from "react";

export default function ResponsiveItemsGrid() {
    const [selectedItem, setSelectedItem] = useState<number | null>(0);

    return (
        <div className="w-full">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 shadow-2xl pt-4">
                {/* Background overlay with pattern */}
                <div className="relative">
                    {/* Horizontal scrolling container */}
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 md:gap-6 py-6 justify-between px-4">
                            {ItemsType.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        setSelectedItem(
                                            selectedItem === index
                                                ? null
                                                : index
                                        )
                                    }
                                    className={cn(
                                        "group relative overflow-hidden flex-shrink-0",
                                        "w-26 h-26 md:w-40 md:h-40 lg:w-44 lg:h-44",
                                        "bg-white/10 backdrop-blur-md",
                                        "border-2 transition-all duration-300 ease-out",
                                        "rounded-xl md:rounded-2xl",
                                        "cursor-pointer",
                                        "flex items-center justify-center",
                                        "text-center",
                                        // Hover effects
                                        "hover:scale-110 hover:-translate-y-3",
                                        "hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30",
                                        "hover:shadow-2xl hover:shadow-blue-500/40",
                                        "hover:border-blue-400/60",
                                        // Selected state
                                        selectedItem === index
                                            ? "border-blue-400 bg-gradient-to-br from-blue-500/40 to-purple-500/40 shadow-xl shadow-blue-500/50 scale-105"
                                            : "border-white/20"
                                    )}
                                >
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/30 group-hover:via-purple-400/30 group-hover:to-pink-400/30 rounded-xl md:rounded-2xl transition-all duration-300"></div>

                                    {/* Selected glow effect */}
                                    {selectedItem === index && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-xl md:rounded-2xl animate-pulse"></div>
                                    )}

                                    {/* Content */}
                                    <div className="relative z-10 p-3 md:p-4">
                                        <div
                                            className={cn(
                                                "w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-lg flex items-center justify-center transition-all duration-300",
                                                selectedItem === index
                                                    ? "bg-gradient-to-r from-blue-300 to-purple-300 scale-110"
                                                    : "bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-110 group-hover:from-blue-300 group-hover:to-purple-300"
                                            )}
                                        >
                                            <div className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-sm"></div>
                                        </div>
                                        <span
                                            className={cn(
                                                "font-semibold text-sm md:text-base lg:text-lg transition-colors duration-300",
                                                selectedItem === index
                                                    ? "text-blue-200"
                                                    : "text-white group-hover:text-blue-200"
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    </div>

                                    {/* Active indicator */}
                                    {selectedItem === index && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
