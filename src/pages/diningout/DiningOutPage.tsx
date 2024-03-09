import Container from "@mui/material/Container";
import Categories from "./Categories";
import Carousel from "../../common/component/Carousal";
import { useGetAllDiningOutProducts } from "../../customRQHooks/Hooks";
import Box from "@mui/material/Box";
import { navigate, useHref } from "react-router-dom";
import { useState } from "react";

function DiningOutPage() {
  const categoryWithProducts = useGetAllDiningOutProducts();
  const [selectedMenuId, setSelectedMenuId] = useState<string>();

  const onSubMenuClick = (submenuId: string) => {
    setSelectedMenuId(submenuId);
  };
  console.log(selectedMenuId);

  return (
    <>
      <Categories
        categories={categoryWithProducts.data?.map((category) => ({
          _id: category.menuDatas._id,
          title: category.menuDatas.title,
        }))}
        onCategoryClick={onSubMenuClick}
      />

      {categoryWithProducts.isSuccess &&
        categoryWithProducts.data.map((category, index) => (
          <Box key={index}>
            <Carousel category={category} />
          </Box>
        ))}
    </>
  );
}

export default DiningOutPage;
