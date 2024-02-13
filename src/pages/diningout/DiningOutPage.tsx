import Container from "@mui/material/Container";
import Categories from "./Categories";
import Carousel from "../../common/component/Carousal";
import { useGetAllDiningOutProducts } from "../../customRQHooks/Hooks";
import Box from "@mui/material/Box";

function DiningOutPage() {
  const categoryWithProducts = useGetAllDiningOutProducts();

  return (
    <Container>
      <Categories />
      {categoryWithProducts.isSuccess &&
        categoryWithProducts.data.map((category, index) => (
          <Box key={index}>
            <Carousel category={category} />
          </Box>
        ))}
    </Container>
  );
}

export default DiningOutPage;
