import { del, get, post, put } from "@/libs/init.axios";
import type { Question, Quiz } from "../type";
import { useQuizStore } from "../store/quizStore";

export const useQuizRequest = () => {
    const action = useQuizStore.getState().action;
    const createQuizAPI = () => post({ url: "quiz/create" });

    const editQuizAPI = (value: Partial<Quiz>) => {
        const quizId = sessionStorage.getItem("quizId");
        return put({ url: `quiz/${quizId}`, data: { quiz: value } });
    };

    const deleteSlideAPI = (slideId: string) => {
        const quizId = sessionStorage.getItem("quizId");
        return del({ url: `quiz/${quizId}/${slideId}` });
    };

    const uploadMediaApi = (formData: FormData) => {
        return post({
            url: "files/upload",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    const createSlideAPI = (value: Question) => {
        return post({
            url: `quiz/slide`,
            data: {
                slide: value,
                quizId: sessionStorage.getItem("quizId"),
            },
        });
    };

    const editSlideAPI = (value: Question) => {
        return put({
            url: `quiz/slide`,
            data: {
                slide: value,
                slideId: value._id,
                action: action,
            },
        });
    };

    const loadQuizById = (quizId: string) => {
        return get({ url: `quiz/${quizId}` });
    };

    const getMediaView = (id: string) => {
        return get({ url: `files/${id}/view` });
    };

    return {
        createQuizAPI,
        editQuizAPI,
        deleteSlideAPI,
        createSlideAPI,
        editSlideAPI,
        loadQuizById,
        uploadMediaApi,
        getMediaView,
    };
};
