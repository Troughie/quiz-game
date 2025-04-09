import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/ui/ButtonCustom";
import Input from "@/components/ui/InputBase";
import { useAuthentication } from "@/hooks/useAuthentication";
import { AuthSchema } from "@/schema/AuthSchema";
import type { SignInCredentials } from "@/types/AuthType";
import { yupResolver } from "@hookform/resolvers/yup";

const Login = () => {
  const [show, setShow] = useState(false);
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login } = useAuthentication();

  const handleLogin = (data: SignInCredentials) => {
    login(data);
    methods.reset();
  };

  return (
    <div className="bg-black-10 relative sm:rounded-xl sm:h-auto sm:mt-8 sm:px-8 text-black-50 container flex flex-col items-stretch self-center h-full max-w-screen-sm gap-4 px-4 pt-4 pb-10 mx-auto">
      <p className="pt-4 pb-8 text-2xl font-bold text-center text-black">
        Sign in
      </p>

      <Button
        text="Continue with google"
        classBg="bg-input z-2 relative w-full py-6 px-4 opacity-[95%]"
        classShadow="bg-black  opacity-40 -bottom-1"
        classContainer=" mb-2"
        classText=" z-2 top-3"
      />
      <FormProvider {...methods}>
        <form className="relative" onSubmit={methods.handleSubmit(handleLogin)}>
          <span className="text-primary font-semibold">
            Or sign in with email
          </span>
          <Input className="" name="email" />
          <span className="flex items-center gap-2 mt-6 -mb-2 text-primary ">
            <span className="font-semibold">Show</span>
            <div
              onClick={() => setShow(!show)}
              className="w-4 h-4 bg-[#00000033] bg-opacity-20 rounded-sm cursor-pointer"
            >
              {show && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 40"
                  className="w-3 h-3 m-0.5"
                >
                  <path
                    fill="currentColor"
                    d="m14.6 33.11-8.31-10a2.88 2.88 0 0 1-.82-2 2.68 2.68 0 0 1 2.8-2.74 2.66 2.66 0 0 1 2.22 1.07l6.61 8.1L30.14 7a2.63 2.63 0 0 1 2.46-1.48 2.7 2.7 0 0 1 2.81 2.73 3.32 3.32 0 0 1-.62 1.86L19.79 33a3 3 0 0 1-2.63 1.34 3.15 3.15 0 0 1-2.56-1.23z"
                  ></path>
                </svg>
              )}
            </div>
          </span>
          <Input className="" name="password" showPassword={show} />

          <Button
            classContainer="mt-8"
            classBg="z-2 relative w-full py-6 px-4 bg-green167"
            classShadow="bg-black opacity-80 -bottom-1"
            text="Sign in"
            classText="text-white z-2 top-3"
          />
        </form>
      </FormProvider>

      <div className="flex justify-around md:mt-16 mt-8 items-center font-bold text-green167">
        <span>
          No account?{" "}
          <a href="#" className="underline">
            Create here
          </a>
        </span>
        <a href="#" className="underline">
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default Login;
