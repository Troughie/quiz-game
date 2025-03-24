import { useLoading } from "@/context/LoadingContext";

const LoadingComponent = () => {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && (
        <div
          className={`fixed bg-black-2 h-screen flex justify-center w-screen z-999999 opacity-70`}
        >
          <div className={`flex justify-center  items-center `}>
            Loading....
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingComponent;
