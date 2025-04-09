import React, { type ReactNode } from "react";
import { type ModalProps } from "antd";
import { useShowFunction } from "@/store/ShowFunction";
import { NAME_SHOW } from "@/constant";
import EditCharacter from "./EditCharacter";

interface ModalBaseProps extends ModalProps {
  Content?: ReactNode;
  // Cho phép tùy chỉnh trigger để mở modal
  // Thêm callback khi OK
  onOk?: () => void;
  // Thêm callback khi Cancel
  onCancel?: () => void;
}

const ModalBase: React.FC<ModalBaseProps> = ({
  Content,

  // onOk,
  // onCancel,
}) => {
  const { isShow } = useShowFunction();

  // const handleOk = () => {
  //   if (onOk) onOk();
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   if (onCancel) onCancel();
  //   setIsModalOpen(false);
  // };

  return (
    <>
      {isShow[NAME_SHOW.MODAL] && (
        <div className="h-screen w-screen absolute z-1 items-center flex justify-center">
          <div className="h-screen absolute w-screen bg-black/40" />
          <div className="h-[500px] z-1 w-[700px] flex items-center justify-center">
            <div className="bg-petrol relative w-full h-full">
              <EditCharacter />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalBase;
