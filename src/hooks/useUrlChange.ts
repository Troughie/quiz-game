import { NAME_SHOW } from "@/constant";
import { useShowFunction } from "@/store/ShowFunction";
import { useCallback, useEffect, useRef } from "react";

export const usePreventNavigation = (shouldPrevent: boolean) => {
    const { setIsBoolean } = useShowFunction();
    const allowNavigationRef = useRef(false);

    // Xử lý nút back/forward của browser
    const handlePopState = useCallback(() => {
        if (shouldPrevent) {
            // Push lại state hiện tại để "undo" việc navigate
            window.history.pushState(null, "", window.location.pathname);

            // Hiển thị modal xác nhận
            setIsBoolean(NAME_SHOW.MODAL, true);
        }
        // Reset flag sau khi xử lý
        allowNavigationRef.current = false;
    }, [shouldPrevent, setIsBoolean]);

    useEffect(() => {
        if (shouldPrevent) {
            // Thêm một entry vào history để có thể "catch" khi user nhấn back
            window.history.pushState(null, "", window.location.pathname);

            // Thêm event listeners
            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }
    }, [shouldPrevent, handlePopState]);
};
