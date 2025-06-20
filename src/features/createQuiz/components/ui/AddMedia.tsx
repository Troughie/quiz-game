import Button from "@/components/ui/ButtonCustom";
import cn from "@/HOC/cn";
import { useEffect, useRef, useState } from "react";
import { VALID_TYPE_CREATE } from "../../type/constant";
import axios from "axios";
import type { BaseTypeUseQuizFunction, quizType } from "../../type";
import useDebounce from "@/hooks/useDebounce";

interface props extends BaseTypeUseQuizFunction {
  type: quizType;
}

const AddMedia = ({ type, quizFunctions }: props) => {
  const {
    handleEditQuizApi,
    currentSlideIndex,
    editQuiz,
    quiz,
    selectedSlide,
    handleInputChange,
  } = quizFunctions;
  const inputFile = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<string>();
  const [typeMedia, setTypeMedia] = useState<"image" | "video">("image");
  const [fileSelect, setFileSelect] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceMedia = useDebounce<File | undefined>(fileSelect, 3000);
  const abortRef = useRef<AbortController | null>(null);

  // Hủy bỏ upload khi currentSlideIndex thay đổi
  useEffect(() => {
    return () => {
      // Cleanup: hủy bỏ request khi component unmount hoặc dependencies thay đổi
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [currentSlideIndex]);

  // Chỉ cập nhật reference khi slide thực sự thay đổi
  useEffect(() => {
    // Hủy bỏ upload đang thực hiện khi chuyển slide
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    // Reset states khi chuyển slide - QUAN TRỌNG: phải reset fileSelect để debounce hoạt động
    setIsUploading(false);
    setIsLoading(false);
    setFileSelect(undefined);

    if (type === "settingQuiz") {
      setMedia(quiz.media || "");
    } else {
      setMedia(selectedSlide?.media);
    }
  }, [currentSlideIndex, type, quiz, selectedSlide]);

  const handleClickSelectFile = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  useEffect(() => {
    if (debounceMedia && !abortRef.current) {
      // Chỉ gửi khi có file và không có request đang thực hiện
      handleSendFileToCloudinary(typeMedia, debounceMedia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceMedia, typeMedia]);

  const handleSendFileToCloudinary = async (
    typeMedia: "image" | "video",
    debounceMedia: File
  ) => {
    // Kiểm tra xem có request đang thực hiện không
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", debounceMedia);
      formData.append("upload_preset", "media_quiz_name");
      formData.append("cloud_name", "detngwq25");
      const urlCloudiary = `https://api.cloudinary.com/v1_1/detngwq25/${typeMedia}/upload`;

      const { data } = await axios.post(urlCloudiary, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: abortController.signal,
      });

      // Kiểm tra xem request có bị hủy không
      if (abortController.signal.aborted) {
        return;
      }

      const { url, public_id } = data;
      console.log(public_id);

      if (type === "settingQuiz") {
        handleQuizMedia(url);
      } else {
        handleSlideMedia(url);
      }

      setIsLoading(false);
      setMedia(url);
      setFileSelect(undefined); // Reset fileSelect sau khi upload thành công

      // Clear abort controller sau khi thành công
      abortRef.current = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.code === "ERR_CANCELED"
      ) {
        console.log("Upload aborted");
        // Reset states khi upload bị hủy
        setIsLoading(false);
        setFileSelect(undefined);
      } else {
        console.error("Upload failed:", error);
        setIsLoading(false);
        setFileSelect(undefined); // Reset fileSelect khi lỗi
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isUploading) {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      // Xác định loại media dựa trên file type
      const isVideo = selectedFile.type.startsWith("video/");
      setTypeMedia(isVideo ? "video" : "image");
      setFileSelect(selectedFile);
      setIsLoading(true);
    }
  };

  const handleSlideMedia = (resultMedia: string) => {
    handleInputChange({
      value: resultMedia,
      mode: "media",
    });
  };

  const handleQuizMedia = (resultMedia: string) => {
    const newQuizMedia = { media: resultMedia };
    editQuiz(newQuizMedia);
    handleEditQuizApi(newQuizMedia);
  };

  const handleClear = () => {
    if (isUploading) return;

    // Hủy bỏ upload nếu đang thực hiện
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    setMedia("");
    setFileSelect(undefined);
    setIsLoading(false);

    if (VALID_TYPE_CREATE.includes(type)) {
      handleInputChange({
        value: "",
        mode: "media",
      });
    } else {
      const newQuiz = { ...quiz, media: "" };
      editQuiz(newQuiz);
    }
  };

  return (
    <div
      className={cn(
        // Container responsive: mobile -> tablet -> desktop
        "w-full max-w-sm mx-auto h-40 sm:max-w-md mt-4 sm:h-48 lg:max-w-lg lg:h-64 xl:max-w-xl xl:h-80",
        "py-4 sm:py-6 lg:py-8 relative rounded-lg flex items-center justify-center bg-white/10",
        // Khi có media: full size với responsive
        media && "h-64 sm:h-80 lg:h-96 xl:h-[500px] py-0"
      )}
    >
      {!media && !isLoading && (
        <Button
          text="Add media"
          classBg="bg-blue-600"
          classShadow="bg-blue-800"
          classContainer="w-32 h-8 sm:w-40 sm:h-9 lg:w-48 lg:h-10"
          classText="text-white text-xs sm:text-sm lg:text-base"
          disabled={isUploading}
          onClick={handleClickSelectFile}
        />
      )}
      <form action="">
        <input
          ref={inputFile}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </form>

      {(media || isLoading) && (
        <div className="w-full h-full flex flex-col gap-2 sm:gap-3 lg:gap-4">
          {/* Action buttons - responsive positioning */}
          <div className="flex justify-between items-center p-1 sm:p-2">
            <Button
              text="Clear"
              onClick={handleClear}
              disabled={isUploading || isLoading}
              variant="warning"
              className={cn(
                "rounded-md sm:rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm"
              )}
            />
            <Button
              text="Replace"
              onClick={handleClickSelectFile}
              disabled={isUploading || isLoading}
              variant="success"
              className={cn(
                "rounded-md sm:rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm"
              )}
            />
          </div>

          {/* Media content area - responsive height */}
          <div className="flex-1 min-h-0 px-1 sm:px-2 pb-1 sm:pb-2">
            {isLoading ? (
              <div className="w-full h-full relative animate-pulse rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              </div>
            ) : (
              <img
                src={media}
                alt="Uploaded media"
                className="w-full h-full object-cover rounded-lg sm:rounded-xl bg-black/20"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedia;
