import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/ui/ButtonCustom";
import Input from "@/components/ui/InputBase";
import type { RegisterCredentials } from "@/types/AuthType";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterSchema } from "../AuthenticationSchema";
import { useAuthentication } from "../hooks/useAuthentication";

const Register = () => {
  const [show, setShow] = useState(false);
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const { signUp, loading } = useAuthentication();

  const handleRegister = async (data: RegisterCredentials) => {
    const result = await signUp(data);

    console.log(result);

    methods.reset();
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form
          className="relative"
          onSubmit={methods.handleSubmit(handleRegister)}
        >
          <span className="text-primary font-semibold">
            Or sign in with email
          </span>
          <Input className="" name="email" />
          <br />
          <span className="text-primary font-semibold pt-6">Username</span>
          <Input className="" name="username" />

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
          <div className="flex items-center justify-center">
            <Button
              classContainer="mt-8"
              classBg="bg-green167"
              classShadow="bg-black/70"
              text={!loading ? `Register` : "Loading..."}
              disabled={loading}
              fullWidth
              classText="text-white z-2 top-3"
            />
          </div>
        </form>
      </FormProvider>

      <div className="flex justify-around md:mt-16 mt-8 items-center font-bold text-green167">
        <span>
          Have account?{" "}
          <a href="/login" className="underline">
            Login here
          </a>
        </span>
      </div>
    </div>
  );
};

export default Register;
