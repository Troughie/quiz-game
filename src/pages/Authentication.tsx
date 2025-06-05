import Button from "@/components/ui/ButtonCustom";
import Login from "@/features/authentication/components/Login";
import Register from "@/features/authentication/components/Register";
import { usePath } from "@/hooks/usePath";
import React from "react";

const Authentication = () => {
  const { pathname } = usePath();

  return (
    <div>
      <div className="bg-black-10 relative sm:rounded-xl sm:h-auto sm:mt-8 sm:px-8 text-black-50 container flex flex-col items-stretch self-center h-full max-w-screen-sm gap-4 px-4 pt-4 pb-10 mx-auto">
        <p className="pt-4 pb-8 text-2xl font-bold text-center text-black">
          {pathname.includes("login") ? "Sign in" : "Sign up"}
        </p>

        <div className="flex items-center justify-center">
          <Button
            text="Continue with google"
            classBg="bg-input"
            classShadow="bg-black/30"
            classContainer=" mb-2"
            fullWidth
            classText=" z-2 top-3"
          />
        </div>

        <div>{pathname.includes("login") ? <Login /> : <Register />}</div>
      </div>
    </div>
  );
};

export default Authentication;
