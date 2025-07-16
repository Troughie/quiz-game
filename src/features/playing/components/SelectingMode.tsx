import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Clock, Check } from "lucide-react";
import type { Player } from "@/types/Index";
import ResponsiveItemsGrid from "./ModeType";

interface Quiz {
    id: number;
    name: string;
    description: string;
    image: string;
    difficulty: string;
}

interface Props {
    isOpen?: boolean;
    onClose?: () => void;
    onQuizSelect?: (quizId: number) => void;
    currentPlayers?: Player[];
}

// ----- Component -----
const QuizSelectionModal: React.FC<Props> = ({ isOpen = true }) => {
    const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);

    // Mock quizzes (replace with actual data)
    const mockQuizzes: Quiz[] = [
        {
            id: 1,
            name: "Kiến thức tổng hợp",
            description: "Những câu hỏi thú vị về nhiều lĩnh vực khác nhau",
            image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
            difficulty: "Dễ",
        },
        {
            id: 2,
            name: "Lịch sử Việt Nam",
            description: "Khám phá những trang sử huy hoàng của dân tộc",
            image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
            difficulty: "Trung bình",
        },
        {
            id: 3,
            name: "Khoa học tự nhiên",
            description: "Thử thách kiến thức về vật lý, hóa học, sinh học",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
            difficulty: "Khó",
        },
        {
            id: 4,
            name: "Văn học thế giới",
            description: "Những tác phẩm kinh điển và tác giả nổi tiếng",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
            difficulty: "Trung bình",
        },
        {
            id: 5,
            name: "Địa lý thế giới",
            description: "Khám phá các quốc gia và địa danh nổi tiếng",
            image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=300&fit=crop",
            difficulty: "Dễ",
        },
    ];

    const handleQuizSelect = (quizId: number) => {
        setSelectedQuiz(quizId);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4 flex-col"
            >
                <ResponsiveItemsGrid />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] "
                >
                    {/* Quiz Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockQuizzes.map((quiz) => {
                            const isSelected = selectedQuiz === quiz.id;

                            return (
                                <motion.div
                                    key={quiz.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={
                                        isSelected
                                            ? {
                                                  scale: [1, 1.05, 1],
                                                  rotate: [0, 1, -1, 0],
                                              }
                                            : {}
                                    }
                                    transition={{ duration: 0.3 }}
                                    className={`group`}
                                    onClick={() => handleQuizSelect(quiz.id)}
                                >
                                    <div className="relative flex-shrink-0 xl:w-[18.5rem] lg:w-[14.5rem] md:w-[10.5rem] sm:w-[16.5rem] w-[10.5rem] rounded-[1rem] overflow-hidden p-[0.25rem] bg-black border-amber-600 border-3">
                                        <img
                                            src={quiz.image}
                                            alt={quiz.name}
                                            className="w-full h-48 object-cover rounded-t-xl "
                                        />
                                        <div className="absolute z-1 top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white">
                                            {quiz.difficulty}
                                        </div>

                                        <div className="absolute inset-0 bg-black/50 " />
                                        <h3 className=" absolute text-outline-black top-1/2 left-1/2 -translate-1/2 z-1 font-semibold text-2xl ">
                                            {quiz.name}
                                        </h3>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuizSelectionModal;
