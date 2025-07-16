import { formattedDate } from "@/utils";
import { useProfileGet } from "../functional/getFunction";
import QuizThumbnail from "@/components/QuizThumbnail";
import { Link, useNavigate } from "react-router";
import { useQuizStore } from "@/features/createQuiz/store/quizStore";

const MyQuizzes = () => {
    const { isFetching, quizzes } = useProfileGet();
    const navigate = useNavigate();
    const { reset, setTypeQuiz } = useQuizStore();
    const handleClickViewDetail = (id: string) => {
        navigate(`/detail/${id}`);
    };
    const handleEditQuiz = () => {
        reset();
        setTypeQuiz("selectType");
        navigate("/edit/new");
    };

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-black">My Quizzes</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <QuizThumbnail
                    handleClickButton={handleEditQuiz}
                    mediaUrl={""}
                    name={""}
                    textButton="View"
                />
                {quizzes?.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        You haven't created any quizzes yet
                    </div>
                ) : (
                    quizzes?.map((quiz) => {
                        const mediaUrl = quiz.media
                            ? import.meta.env.VITE_SERVER_URL +
                              `/files/${quiz.media}/view`
                            : "/default-quiz.jpg";
                        return (
                            <div
                                key={quiz._id}
                                className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="aspect-video w-full relative">
                                    <QuizThumbnail
                                        handleClickButton={() =>
                                            handleClickViewDetail(quiz._id)
                                        }
                                        mediaUrl={mediaUrl}
                                        name={quiz.name}
                                        textButton="View"
                                    />
                                </div>
                                <div className="p-4">
                                    <Link
                                        to={`/detail/${quiz._id}`}
                                        className="text-lg font-semibold hover:underline inline-block text-black mb-2 line-clamp-1"
                                    >
                                        {quiz.name || "No name"}
                                    </Link>
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                        {quiz.description || "No description"}
                                    </p>
                                    <div className="flex justify-between items-center gap-4">
                                        {/* <span className="text-xs text-gray-400">
                                            {quiz.tags?.join(", ")}
                                        </span> */}
                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            {quiz.slideCount ?? 0} Questions
                                        </span>
                                        {quiz.createdAt && (
                                            <span className="text-xs">
                                                {formattedDate(quiz.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyQuizzes;
