import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/ButtonCustom";
import { splitPin } from "@/utils";
import { post } from "@/libs/init.axios";
import useRequest from "@/hooks/useMutation";
import { useAuth } from "@/hooks/useAuth";

interface SearchProps {
  searchInput: string;
  handleSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitForm: (e: React.FormEvent) => void;
  className: string;
  error?: string;
}
const SearchPinBar = ({
  searchInput,
  handleSearchValue,
  handleSubmitForm,
  className,
  error,
}: SearchProps) => {
  return (
    <div className="rounded-xl bg-search md:p-4 flex flex-col items-center justify-center w-full gap-2 p-4 overflow-hidden">
      <div className="justify-evenly flex flex-row items-center w-full px-2">
        <div className="whitespace-nowrap flex flex-row items-center gap-4 font-sans md:text-base lg:text-xl text-base font-black leading-tight tracking-normal text-black capitalize">
          <div className="md:flex-row md:gap-2 flex flex-col items-center">
            <div className="lg:block md:hidden block">Join game?</div>
            <div className="lg:hidden md:block hidden">Join?</div>
            <div className="lg:block md:hidden block">Enter PIN:</div>
            <div className="lg:hidden md:block hidden">PIN:</div>
          </div>
          <form className={className} onSubmit={handleSubmitForm}>
            <input
              className="focus:placeholder:text-transparent w-full my-auto font-bold text-center rounded-full h-12 lg:h-14 text-base lg:text-xl bg-white shadow-inner-hard-1 border-black border-solid border-4"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              value={searchInput}
              onChange={(e) => handleSearchValue(e)}
              placeholder="123 456"
              maxLength={7}
              pattern="[0-9]{3} [0-9]{3}"
            />
            {error && (
              <span className="md:flex lg:text-base flex-row items-center text-sm font-normal">
                Wrong pin!
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

interface RightNavbarProps {
  session: boolean;
}
const RightNavbar = ({ session }: RightNavbarProps) => {
  const navigate = useNavigate();

  const buttonSignIn = () => {
    if (!session) {
      return (
        <>
          {" "}
          <Button
            classContainer="text-black md:px-8 md:block hidden h-10 min-w-[100px] border-3 rounded-3xl"
            classShadow="bg-shadow rounded-3xl"
            classBg="bg-cam rounded-3xl"
            text="Sign in"
            classText=""
            onClick={() => {
              navigate("/login");
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <img
            src="#"
            alt="avatar"
            className="size-12 rounded-full bg-red-600 cursor-pointer"
            onClick={() => navigate("/profile")}
          />
        </>
      );
    }
  };

  return (
    <div className="flex gap-4  items-center relative">
      <button className="flex-col justify-center items-center  bg-opacity-10 w-10 h-10 flex-shrink-0 rounded-full block md:hidden">
        <svg
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
        >
          <path
            fill="currentColor"
            d="M12.48 24.516a1.48 1.48 0 0 0-1.48 1.48 1.48 1.48 0 0 0 1.48 1.48h15.04a1.48 1.48 0 0 0 1.48-1.48 1.48 1.48 0 0 0-1.48-1.48zm0-6a1.48 1.48 0 0 0-1.48 1.48 1.48 1.48 0 0 0 1.48 1.48h15.04a1.48 1.48 0 0 0 1.48-1.48 1.48 1.48 0 0 0-1.48-1.48zm0-6a1.48 1.48 0 0 0-1.48 1.48 1.48 1.48 0 0 0 1.48 1.48h15.04a1.48 1.48 0 0 0 1.48-1.48 1.48 1.48 0 0 0-1.48-1.48z"
          ></path>
        </svg>
      </button>

      {buttonSignIn()}
    </div>
  );
};

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [flex, setFlex] = useState("flex-1");
  const [widthSearch, setWidthSearch] = useState("w-10");
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleSearch = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowSearch(!showSearch);
    setFlex(showSearch ? "flex-1" : "flex-0");
    setWidthSearch(showSearch ? "w-10" : "w-1/3");
  };

  useEffect(() => {
    const closeSearch = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setFlex("flex-1");
        setWidthSearch("w-10");
      }
    };
    document.addEventListener("click", closeSearch);
    return () => {
      document.removeEventListener("click", closeSearch);
    };
  }, []);

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\s/g, "");

    setSearchInput(splitPin(cleanedValue));
  };

  const { mutate: submitPin } = useRequest({
    mutationFn: (pin: string) => {
      return post({ url: "lobby/submit-pin", data: { pin } });
    },
    onSuccess: () => {
      navigate(`/${searchInput.split(" ").join("")}`);
    },
    onError: (err) => {
      setError(err.message);
    },
    showSuccess: false,
    showSwal: false,
  });

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    submitPin(searchInput);
  };
  return (
    <>
      <div className="flex sticky top-0 items-center justify-between w-full h-20 my-8 px-10">
        <img src="#" alt="" className="flex-1 w-[200px] h-20" />
        <div className="space-x-2 flex items-center relative ">
          <div className={`hidden px-4 md:flex ${flex} items-center`}>
            <SearchPinBar
              className="md:max-w-md flex gap-4 justify-center w-full"
              handleSearchValue={handleSearchValue}
              handleSubmitForm={handleSubmitForm}
              searchInput={searchInput}
              error={error}
            />
          </div>
          <form
            ref={formRef}
            className={`relative ${widthSearch} h-10 transition-[width,background-color,border] duration-300 md:transition-none overflow-hidden rounded-full border-3 bg-[#e5e3dc] border-opacity-20 border-[#e5e3dc]`}
          >
            <input
              onClick={(e) => handleSearch(e)}
              type="button"
              placeholder="Search"
              className="absolute   border-0 transition-[color,padding] duration-300 md:transition-none text-left pl-4 pr-4 h-[34px] placeholder:opacity-70 focus:placeholder:text-transparent overflow-hidden text-base font-bold opacity-70 cursor-pointer text-transparent placeholder:text-transparent"
            />
            {showSearch && (
              <input
                type="search"
                placeholder="Search"
                className="inset-0 absolute  border-0 transition-[color,padding] duration-300 md:transition-none text-left pl-4 placeholder:text-black placeholder:opacity-70 focus:outline-0  focus:placeholder:text-transparent text-black overflow-hidden text-base font-bold opacity-70 cursor-text px-2"
              />
            )}

            <button
              type="submit"
              aria-label="Search"
              className="cursor-pointer absolute  w-8 h-8 bg-[#e5e3dc] rounded-full transition-[right,background-color] duration-300 md:transition-none pointer-events-none right-[1px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                className="relative w-8 h-8"
              >
                <path fill="none" d="M0 0h40v40H0z"></path>
                <path
                  fill="currentColor"
                  d="M18.18 27.82a8.55 8.55 0 0 1-3.41-.68A8.86 8.86 0 0 1 12 25.23a9 9 0 0 1-1.9-2.81 8.89 8.89 0 0 1 0-6.82 8.86 8.86 0 0 1 1.9-2.81 9.17 9.17 0 0 1 2.81-1.9 8.75 8.75 0 0 1 6.81 0 9.1 9.1 0 0 1 2.82 1.9 8.9 8.9 0 0 1 1.89 2.82 8.75 8.75 0 0 1 0 6.81 9 9 0 0 1-1.89 2.81 8.79 8.79 0 0 1-2.82 1.91 8.48 8.48 0 0 1-3.44.68Zm0-2.54a6 6 0 0 0 2.44-.49A6.36 6.36 0 0 0 24 21.44a6.25 6.25 0 0 0 0-4.85 6.09 6.09 0 0 0-1.35-2 6.35 6.35 0 0 0-2-1.36 6.3 6.3 0 0 0-4.87 0 6.39 6.39 0 0 0-2 1.36 6.22 6.22 0 0 0-1.34 2 6.25 6.25 0 0 0 0 4.85 6.33 6.33 0 0 0 1.34 2 6.2 6.2 0 0 0 2 1.35 6 6 0 0 0 2.4.49Zm10.69 6.36a2 2 0 0 1-.69-.12 1.62 1.62 0 0 1-.59-.38l-5.74-5.73 2.56-2.53 5.72 5.72a1.62 1.62 0 0 1 .38.59 2 2 0 0 1 .12.67 1.83 1.83 0 0 1-.22.91 1.78 1.78 0 0 1-.64.64 1.72 1.72 0 0 1-.9.23Z"
                ></path>
              </svg>
            </button>
            <button
              type="reset"
              aria-label="Reset"
              className="top-[1px] right-10 absolute w-8 h-8 bg-[#e5e3dc] rounded-full hidden transition-[background-color] duration-300 md:transition-none pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                className="relative w-8 h-8"
              >
                <path
                  fill="currentColor"
                  d="M16 31a11.76 11.76 0 0 1-6.17-6.16 11.48 11.48 0 0 1 0-8.91A11.76 11.76 0 0 1 16 9.81a11.43 11.43 0 0 1 8.89 0 11.73 11.73 0 0 1 3.68 2.49A12 12 0 0 1 31 16a10.94 10.94 0 0 1 .91 4.45 11.18 11.18 0 0 1-.9 4.46A11.85 11.85 0 0 1 24.85 31 11.45 11.45 0 0 1 16 31Zm1.53-6.11L20.41 22l2.93 2.93a1.11 1.11 0 0 0 .8.33 1.07 1.07 0 0 0 .79-.32 1.09 1.09 0 0 0 .31-.79 1.06 1.06 0 0 0-.33-.77L22 20.43l3-2.95a1.1 1.1 0 0 0 0-1.55 1 1 0 0 0-.78-.32 1 1 0 0 0-.78.32l-3 3L17.46 16a1 1 0 0 0-.79-.32 1.09 1.09 0 0 0-.78.31 1.06 1.06 0 0 0-.32.78 1 1 0 0 0 .33.77l2.94 2.94-2.94 3a1 1 0 0 0-.33.76 1.12 1.12 0 0 0 1.91.78Z"
                ></path>
              </svg>
            </button>
          </form>
          {<RightNavbar session={!!session} />}
        </div>
      </div>
      <div className={`flex px-4 md:hidden mb-2 items-center`}>
        <SearchPinBar
          className="md:max-w-md flex items-center gap-4 justify-center w-full"
          handleSearchValue={handleSearchValue}
          handleSubmitForm={handleSubmitForm}
          error={error}
          searchInput={searchInput}
        />
      </div>
    </>
  );
};

export default Navbar;
