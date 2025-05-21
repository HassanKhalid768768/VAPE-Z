import Categories from "../../components/home/Categories";
import HomeProduct from "../../components/home/HomeProduct";
import Nav from "../../components/home/Nav";
import Slider from "../../components/home/Slider";
import { useRandomCategoriesQuery } from "../../store/services/categoryService";
import FaqSection from "../../components/home/FaqSection";
import Footer from "../../components/home/Footer";
import MapSection from "../../components/home/MapSection";

const Home = () => {
  const { data, isFetching } = useRandomCategoriesQuery();
  return (
    <>
      <Nav />
      <div className="mt-[70px]">
        <Slider />
      </div>
      <div className="my-container mt-10">
        <Categories />
        {!isFetching &&
          data?.categories?.length > 0 &&
          data?.categories.map((category) => (
            <HomeProduct category={category} key={category._id} />
          ))}
      </div>
      <div>
        <FaqSection></FaqSection>
      </div>
      <div>
        <MapSection></MapSection>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </>
  );
};
export default Home;
