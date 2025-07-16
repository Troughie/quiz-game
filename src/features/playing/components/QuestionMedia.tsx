import { motion as m } from "framer-motion";
import { useMemo } from "react";

interface QuestionMediaProps {
    media?: string;
    funFact?: string;
    showFunFact: boolean;
}

export const QuestionMedia = ({
    media,
    funFact,
    showFunFact,
}: QuestionMediaProps) => {
    const variants = {
        initial: { scale: 0 },
        animate: { scale: 1 },
    };

    const mediaUrl = useMemo(
        () => import.meta.env.VITE_SERVER_URL + `/files/${media}/view`,
        [media]
    );
    if (!media)
        return (
            <>
                {showFunFact && funFact && (
                    <m.div
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.4 }}
                        className="absolute inset-1 text-white tex"
                    >
                        <div className="bg-black/60 w-full h-full absolute" />
                        <span className="absolute text-4xl top-1/2 left-1/2 -translate-x-1/2">
                            {funFact}
                        </span>
                    </m.div>
                )}
            </>
        );

    return (
        <div className="w-full md:w-1/3 relative  space-y-6">
            <m.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="aspect-video w-full  rounded-lg overflow-hidden bg-black/20"
            >
                <img
                    src={mediaUrl}
                    alt="Question media"
                    className="w-full h-full object-cover"
                />
            </m.div>

            {showFunFact && funFact && (
                <m.div
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.4 }}
                    className="absolute inset-1 text-white tex"
                >
                    <div className="bg-black/60 w-full h-full absolute" />
                    <span className="absolute text-4xl top-1/2 left-1/2 -translate-x-1/2">
                        {funFact}
                    </span>
                </m.div>
            )}
        </div>
    );
};
