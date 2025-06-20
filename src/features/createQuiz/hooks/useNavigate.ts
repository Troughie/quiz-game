import { useNavigate } from "react-router";
import { NavigationType, type NavigationParams } from "../type";
import { useQuizStore } from "../store/quizStore";
import { usePath } from "@/hooks/usePath";

export const useHandleNavigation = () => {
  const { setTypeQuiz } = useQuizStore();
  const navigate = useNavigate();
  const { pathExcludeNum, pathname, path } = usePath();

  const handleNavigation = (params: NavigationParams) => {
    const { type, slideIndex, quizId, replaceUrl = false, delay = 0 } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navigateWithDelay = (path: string, options?: any) => {
      if (delay > 0) {
        setTimeout(() => {
          navigate(path, options);
        }, delay);
      } else {
        navigate(path, options);
      }
    };

    switch (type) {
      case NavigationType.SELECT_TYPE: {
        setTypeQuiz("selectType");
        const selectTypePath = pathExcludeNum.includes("new")
          ? pathname
          : pathExcludeNum;
        navigateWithDelay(selectTypePath, { replace: replaceUrl });
        break;
      }

      case NavigationType.QUIZ_SLIDE:
        if (slideIndex !== undefined) {
          const basePath = quizId ? `/edit/${quizId}` : pathExcludeNum;
          navigateWithDelay(`${basePath}/${slideIndex}`, {
            replace: replaceUrl,
          });
        }
        break;

      case NavigationType.SETTING:
        setTypeQuiz("settingQuiz");
        navigateWithDelay(`${pathExcludeNum}/setting`, { replace: replaceUrl });
        break;

      case NavigationType.REDIRECT_NEW_TO_ID:
        if (quizId) {
          console.log(slideIndex);

          const newPath = pathname.replace("new", quizId);
          const paramAfterId =
            !isNaN(Number(path)) || path === "setting" ? "" : `/${slideIndex}`;
          navigateWithDelay(`${newPath}${paramAfterId}`, { replace: true });
        }
        break;
    }
  };

  return handleNavigation;
};
