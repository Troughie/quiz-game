import { ButtonBase } from "@/components/ui/Button";
import Button from "@/components/ui/ButtonCustom";
import cn from "@/HOC/cn";
import { useEffect, useRef, useState } from "react";
import { useQuizStore } from "../../store/quizStore";
import { VALID_TYPE_CREATE } from "../../constant";
import {
  useQuizFunction,
  type Options_change,
} from "../../functional/functional";
import axios from "axios";
import type { quizType } from "../../type";
import useDebounce from "@/hooks/useDebounce";

interface props {
  type: quizType;
  handleAnswerChange: ({
    value,
    index,
    mode,
    slideIdProp,
  }: Options_change) => void;
}

const AddMedia = ({ type, handleAnswerChange }: props) => {
  const { getSlide, currentSlideIndex, editQuiz, quiz } = useQuizStore();

  const { handleEditQuizApi } = useQuizFunction();
  const inputFile = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<string>();
  const [typeMedia, setTypeMedia] = useState<"image" | "video">("image");
  const [fileSelect, setFileSelect] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const debounceMedia = useDebounce<File | undefined>(fileSelect, 3000);
  const abortRef = useRef<AbortController | null>(null);

  // Chỉ cập nhật reference khi slide thực sự thay đổi
  useEffect(() => {
    if (type === "settingQuiz") {
      setMedia(quiz.media || "");
    } else {
      const slide = getSlide();
      setMedia(slide.media);
    }
  }, [currentSlideIndex, getSlide, type, quiz]);

  const handleClick = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  useEffect(() => {
    if (debounceMedia) {
      console.log(debounceMedia);
      if (abortRef.current) {
        abortRef.current.abort();
      }

      handleSendFileToCloudinary(typeMedia, debounceMedia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceMedia]);

  const handleSendFileToCloudinary = async (
    typeMedia: "image" | "video",
    debounceMedia: File
  ) => {
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const data = new FormData();
      data.append("file", debounceMedia);
      data.append("upload_preset", "media_quiz_name");
      data.append("cloud_name", "detngwq25");
      const url = `https://api.cloudinary.com/v1_1/detngwq25/${typeMedia}/upload`;
      const result = await axios.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: abortController.signal,
      });

      const resultUrl = result?.data?.url;
      if (type === "settingQuiz") {
        handleQuizMedia(resultUrl);
      } else {
        handleSlideMedia(resultUrl);
      }
      setFileSelect(undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.code === "ERR_CANCELED"
      ) {
        console.log("Upload aborted");
      } else {
        console.error("Upload failed:", error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isUploading) {
      setIsUploading(true);
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      setFileSelect(selectedFile);
      setTypeMedia("image");

      // Set preview trước khi upload
      const previewUrl = URL.createObjectURL(selectedFile);
      setMedia(previewUrl);
    }
  };

  const handleSlideMedia = (resultMedia: string) => {
    handleAnswerChange({
      value: resultMedia,
      mode: "media",
      slideIdProp: getSlide()?._id || "",
    });
  };

  const handleQuizMedia = (resultMedia: string) => {
    const newQuizMedia = { media: resultMedia };
    editQuiz(newQuizMedia);
    handleEditQuizApi(newQuizMedia);
  };

  const handleClear = () => {
    if (isUploading) return;

    setMedia("");
    if (VALID_TYPE_CREATE.includes(type)) {
      handleAnswerChange({
        value: "",
        mode: "media",
        slideIdProp: getSlide()?._id || "",
      });
    } else {
      const newQuiz = { ...quiz, media: "" };
      editQuiz(newQuiz);
    }
  };

  return (
    <div
      className={cn(
        "w-2/3 h-10 lg:size-[500px] py-8 relative rounded-lg flex items-center justify-center bg-white/10",
        media && "size-[500px] mt-10 lg:mt-0 py-0"
      )}
    >
      {!media && (
        <Button
          text="Add media"
          classBg="bg-blue-600"
          classShadow="bg-blue-800"
          classContainer="w-[200px] h-10"
          classText="text-white"
          disabled={isUploading}
          onClick={handleClick}
        />
      )}
      <form action="">
        <input
          ref={inputFile}
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </form>
      {media && (
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <ButtonBase
              onClick={handleClear}
              disabled={isUploading}
              className={cn(
                "rounded-lg m-2",
                isUploading && "opacity-50 cursor-not-allowed"
              )}
            >
              Clear
            </ButtonBase>
            <ButtonBase
              onClick={handleClick}
              disabled={isUploading}
              className={cn(
                "rounded-lg m-2",
                isUploading && "opacity-50 cursor-not-allowed"
              )}
            >
              Replace
            </ButtonBase>
          </div>
          <img
            src={media}
            className={cn("w-full h-full z-1 bg-black rounded-2xl p-4")}
          />
        </div>
      )}
    </div>
  );
};

export default AddMedia;
