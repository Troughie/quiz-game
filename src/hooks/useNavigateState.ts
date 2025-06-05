import { useNavigate } from "react-router-dom";

export function useDynamicNavigate<T = undefined>() {
  const navigate = useNavigate();

  return (url: string, state?: T extends undefined ? never : T) => {
    navigate(url, { state });
  };
}
