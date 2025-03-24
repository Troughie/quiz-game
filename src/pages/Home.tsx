import Card from "@/components/layouts/Card";
import NavHome from "@/components/layouts/NavHome";
import Slider from "@/components/layouts/Slider";
interface props {
  title: string;
  author: string;
  rating: number;
  image: string;
}
const data: props[] = [
  { title: "Title2", author: "Author", rating: 5, image: "Image" },
  { title: "Title3", author: "Author", rating: 5, image: "Image" },
  { title: "Title4", author: "Author", rating: 5, image: "Image" },
  { title: "Title5", author: "Author", rating: 5, image: "Image" },
  { title: "Title6", author: "Author", rating: 5, image: "Image" },
  { title: "Title7", author: "Author", rating: 5, image: "Image" },
  { title: "Title8", author: "Author", rating: 5, image: "Image" },
  { title: "Title9", author: "Author", rating: 5, image: "Image" },
  { title: "Title10", author: "Author", rating: 5, image: "Image" },
];
const Home = () => {
  return (
    <div className="flex flex-col gap-16">
      <NavHome />
      <Slider data={data} Component={Card} />
    </div>
  );
};

export default Home;
