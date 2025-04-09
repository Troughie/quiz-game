import { NAME_SHOW } from "@/constant";
import { useShowFunction } from "@/store/ShowFunction";
import { useEffect } from "react";
export const useUrlChange = () => {
  const { setIsShow } = useShowFunction();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setIsShow(NAME_SHOW.MODAL, true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return {};
};
