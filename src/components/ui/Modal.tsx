import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button, { type ButtonProps } from "./ButtonCustom";
import cn from "@/HOC/cn";

// Interface cho các props của Modal
interface CustomModalProps {
  // Props cơ bản
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  children: React.ReactNode;

  // Props cho buttons
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmButtonProps?: Omit<ButtonProps, "text">;
  cancelButtonProps?: Omit<ButtonProps, "text">;

  // Props cho styling
  width?: string; // Để tiện sử dụng với Tailwind
  maxWidth?: string;
  containerClassName?: string;
  modalClassName?: string;
  overlayClassName?: string;
  footerClassName?: string;
  centered?: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  showBtn?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen: externalIsOpen,
  onOpenChange,
  trigger,
  children,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonProps,
  cancelButtonProps,
  width = "md",
  maxWidth = "4xl",
  containerClassName = "",
  modalClassName = "",
  overlayClassName = "",
  footerClassName = "",
  centered = true,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  showBtn = true,
}) => {
  // State local nếu không dùng controlled mode
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Quyết định sử dụng state nào
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Xử lý đóng mở
  const handleOpen = () => {
    if (onOpenChange) {
      onOpenChange(true);
    } else {
      setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setInternalIsOpen(false);
    }
  };

  // Xử lý xác nhận
  const handleConfirm = async () => {
    if (onConfirm) {
      setLoading(true);
      try {
        await onConfirm();
        handleClose();
      } catch (error) {
        console.error("Error in onConfirm:", error);
      } finally {
        setLoading(false);
      }
    } else {
      handleClose();
    }
  };

  // Xử lý cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };

  // Xử lý ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (closeOnEsc && isOpen && event.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, closeOnEsc]);

  // Prevent scroll khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Xác định width classes dựa trên prop width
  const widthClasses =
    {
      sm: "w-full sm:w-96",
      md: "w-full sm:w-9/12 md:w-8/12 lg:w-6/12",
      lg: "w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12",
      xl: "w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12",
      full: "w-full",
    }[width] || "w-full sm:w-8/12 md:w-6/12";

  // Xác định max-width classes
  const maxWidthClasses =
    {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
      none: "max-w-none",
    }[maxWidth] || "max-w-2xl";

  // Component Modal
  const ModalComponent = isOpen
    ? ReactDOM.createPortal(
        <div
          className={`fixed inset-0 z-50 flex ${
            centered ? "items-center" : "items-start pt-16"
          } justify-center overflow-y-auto ${containerClassName}`}
        >
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/60 bg-opacity-50 transition-opacity duration-300 ${overlayClassName}`}
            onClick={closeOnOverlayClick ? handleCancel : undefined}
          />

          {/* Modal */}
          <div
            className={cn(
              `relative ${widthClasses} ${maxWidthClasses} bg-white rounded-lg shadow-xl transform transition-all duration-300 p-6 `,
              modalClassName
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Body */}
            <div className="mb-6">{children}</div>

            {/* Footer */}
            {showBtn && (
              <div
                className={`flex justify-center space-x-4 ${footerClassName}`}
              >
                <Button
                  text={cancelText}
                  {...cancelButtonProps}
                  onClick={handleCancel}
                  className={`px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                    cancelButtonProps?.className || ""
                  }`}
                />

                <Button
                  text={loading ? "Loading..." : confirmText}
                  {...confirmButtonProps}
                  onClick={handleConfirm}
                  disabled={loading || confirmButtonProps?.disabled}
                  className={`px-4 py-2 rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  } ${confirmButtonProps?.className || ""}`}
                />
              </div>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {trigger && <div onClick={handleOpen}>{trigger}</div>}
      {ModalComponent}
    </>
  );
};

export default CustomModal;
