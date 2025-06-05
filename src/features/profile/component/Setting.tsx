import Button from "@/components/ui/ButtonCustom";
import { useAuthentication } from "@/features/authentication/hooks/useAuthentication";
import React from "react";
import { useNavigate } from "react-router";

const Setting = () => {
  const navigate = useNavigate();
  const { logOut } = useAuthentication();
  const handleLogout = () => {
    logOut();
    navigate("/");
  };
  return (
    <div>
      <div></div>
      <Button
        text="Sign out"
        variant="secondary"
        classContainer="border-3 border-black"
        onClick={handleLogout}
      />
    </div>
  );
};

export default Setting;
