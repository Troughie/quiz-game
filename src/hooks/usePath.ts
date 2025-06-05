import { useMemo } from "react";
import { useLocation } from "react-router";

export const usePath = () => {
  const { pathname } = useLocation();

  const path = useMemo(() => {
    return pathname.split("/").pop();
  }, [pathname]);

  const pathExcludeNum = useMemo(() => {
    if (path && !Number.isNaN(parseInt(path))) {
      return pathname.split("/").slice(0, -1).join("/");
    } else {
      return pathname;
    }
  }, [pathname, path]);

  return { path, pathExcludeNum, pathname };
};
