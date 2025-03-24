import { useEffect, type ReactElement } from "react";
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type Path,
  type PathValue,
} from "react-hook-form";
import cn from "@/HOC/cn";

interface FormControllerProps<T extends Record<string, string | number>> {
  name: Path<T>;
  render?: (props: {
    field: ControllerRenderProps<T, Path<T>>;
  }) => ReactElement;
  className?: string;
  value?: PathValue<T, Path<T>>;
  showPassword?: boolean;
}

const Input = <T extends Record<string, string | number>>({
  className,
  name,
  render,
  value,
  showPassword,
}: FormControllerProps<T>) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<T>();

  useEffect(() => {
    if (value !== undefined) {
      setValue(name, value as PathValue<T, Path<T>>);
    }
  }, [value, name, setValue]);

  return (
    <div className="relative h-12 group mt-4">
      <Controller
        name={name}
        control={control}
        render={
          render
            ? render
            : ({ field }) => {
                return (
                  <input
                    {...field}
                    type={
                      name === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : "text"
                    }
                    className={cn(
                      "font-medium absolute inset-0 px-4 py-6 mb-3 w-full text-base text-black placeholder-black placeholder-opacity-50 focus:placeholder-opacity-0 z-1 text-left focus:outline-0 bg-input disabled:brightness-75 hover:bg-input-hover focus:bg-input rounded-lg",
                      className
                    )}
                    name={name}
                  />
                );
              }
        }
      />
      {errors[name] && (
        <span className="mb-[-10px] text-red-500 absolute -bottom-4">
          {errors[name]?.message?.toString()}
        </span>
      )}
      <div className="absolute inset-0 opacity-50 group-hover:opacity-100 -top-1 bg-shadow rounded-lg z-0"></div>
    </div>
  );
};

export default Input;
