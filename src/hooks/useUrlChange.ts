import { NAME_SHOW } from "@/constant";
import { useShowFunction } from "@/store/ShowFunction";
import { useEffect } from "react";
export const useUrlChange = () => {
  const { setIsBoolean } = useShowFunction();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setIsBoolean(NAME_SHOW.MODAL, true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {};
};
