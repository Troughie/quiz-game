import React, { useEffect, useState } from "react";
import { useProfileGet } from "../functional/getFunction";
import type { Quiz } from "@/features/createQuiz/type";

const MyQuizzes = () => {
  const { isFetching, quizzes } = useProfileGet();
  const [quizzess, setQuizzess] = useState<Quiz[]>([]);

  useEffect(() => {
    setQuizzess(quizzes);
  }, [quizzes]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-black">My Quizzes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {quizzess?.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300"
          >
            <div className="aspect-video w-full relative">
              <img
                src={quiz.media || "/default-quiz.jpg"}
                alt={quiz.name}
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-black mb-2 line-clamp-1">
                {quiz.name || "No name"}
              </h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {quiz.description || "No description"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {quiz.tags?.join(", ")}
                </span>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {quiz.slides?.length || 0} Questions
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {quizzess?.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          You haven't created any quizzes yet
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
