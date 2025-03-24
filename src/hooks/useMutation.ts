import { useLoading } from "@/context/LoadingContext";
import { typeAlert } from "@/types/Index";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { sweetAlert } from "./useSweet";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends UseMutationOptions<any, any, any, any> {
  errorToast?: string | null;
  showSuccess?: boolean;
  showSwal?: boolean;
}
const useRequest = ({
  onSuccess,
  onError,
  showSuccess = true,
  ...props
}: Props) => {
  const { setIsLoading } = useLoading();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutate = useMutation<unknown, unknown, any, unknown>({
    ...props,
    onMutate: () => {
      if (showSuccess) {
        setIsLoading(true);
      }
    },
    onSettled: () => {
      if (showSuccess) {
        setIsLoading(false);
      }
    },
    onSuccess(res, variables: void, context: unknown) {
      onSuccess?.(res, variables, context);
      sweetAlert({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: (res as any)?.success ? typeAlert.success : typeAlert.error,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (res as any)?.message,
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError(err: any, variables: void, context: unknown) {
      onError?.(err, variables, context);
      if (err && err.message) {
        sweetAlert({
          message: err?.message,
          type: typeAlert.error,
        });
      }
    },
  });
  return mutate;
};

export default useRequest;
