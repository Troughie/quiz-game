// components/FormProvider.tsx
import React, { type ReactNode } from "react";
import {
  useForm,
  FormProvider as RHFormProvider,
  type SubmitHandler,
  type FieldValues,
  type DefaultValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormProviderProps<T extends FieldValues> = {
  children: ReactNode;
  defaultValues: DefaultValues<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema: yup.ObjectSchema<any>;
  onSubmit: SubmitHandler<T>;
  mode?: "onChange" | "onBlur" | "all" | undefined;
};

export function FormProvider<T extends FieldValues>({
  children,
  defaultValues,
  validationSchema,
  onSubmit,
  mode = "onChange",
}: FormProviderProps<T>) {
  const methods = useForm<T>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: mode,
  });

  return (
    <RHFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </RHFormProvider>
  );
}
