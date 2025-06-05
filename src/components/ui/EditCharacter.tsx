import React from "react";
import { ButtonBase } from "./Button";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CharacterSchema } from "@/schema/Charater";
import { usePlayerStore } from "@/store/Player";
import Input from "./InputBase";
import { useShowFunction } from "@/store/ShowFunction";
import { NAME_SHOW } from "@/constant";

const EditCharacter = () => {
  const { player } = usePlayerStore();
  const { setIsBoolean } = useShowFunction();
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(CharacterSchema),
    defaultValues: {
      name: player?.name || "",
    },
  });
  const closeModal = () => {
    setIsBoolean(NAME_SHOW.MODAL, false);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex justify-between bg-black/70 py-8 px-2 items-center">
        <ButtonBase className="rounded-3xl font-bold" onClick={closeModal}>
          Cancel
        </ButtonBase>
        <ButtonBase className="rounded-3xl font-bold ">Done</ButtonBase>
      </div>
      <div className=" absolute top-0 right-1/2 h-full w-[300px] flex flex-col translate-x-1/2  justify-center gap-10">
        <Input name="name" className=" " />

        <div className="size-40 mx-auto rounded-full bg-black"></div>
      </div>
    </FormProvider>
  );
};

export default EditCharacter;
