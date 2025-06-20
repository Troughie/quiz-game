import Button from "@/components/ui/ButtonCustom";

const Header = () => {
  return (
    <div className="flex gap-4 sticky top-0 z-10 w-full py-6 bg-petrol shadow-md shadow-black">
      <div className="w-30 h-10"></div>
      <Button text="Done" classContainer="w-20" onClick={() => {}} />
      <Button text="Preview" classContainer="w-20" />
    </div>
  );
};

export default Header;
