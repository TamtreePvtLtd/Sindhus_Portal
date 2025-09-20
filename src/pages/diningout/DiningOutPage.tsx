import Categories from "./Categories";
import Carousel from "../../common/component/Carousal";
import { useGetAllDiningOutProducts } from "../../customRQHooks/Hooks";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { ICategory } from "../../interface/types";
import CommonProductCard from "../../common/component/CommonProductCard";
import { Container, Grid } from "@mui/material";

function DiningOutPage() {
  const categoryWithProducts = useGetAllDiningOutProducts();
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [selectedCategory, setselectedCategory] = useState<ICategory | []>([]);

  const onSubMenuClick = (subMenuId: string) => {
    setSelectedMenuId(subMenuId);

  };

  useEffect(() => {
    if (selectedMenuId) {
      const selectedCategory = categoryWithProducts.data?.find(
        (category) => category.menuDatas._id === selectedMenuId
      );

      setselectedCategory(selectedCategory);
    }
  }, [selectedMenuId]);

  return (
    <>
      <Box>
        <Categories
          categories={categoryWithProducts.data?.map((category) => ({
            _id: category.menuDatas._id,
            title: category.menuDatas.title,
          }))}
          onSubMenuClick={onSubMenuClick}
          selectedSubMenuId={selectedMenuId}
        />

        <Container>
          {selectedMenuId === "" ? (
            categoryWithProducts.isSuccess &&
            categoryWithProducts.data.map((category, index) => (
              <Box key={index}>
                <Carousel category={category} onSubMenuClick={onSubMenuClick} />
              </Box>
            ))
          ) : (
            <Container>
              {selectedCategory && selectedCategory.menuDatas && (
                <Box sx={{ padding: "25px" }}>
                  <Grid container spacing={2}>
                    {selectedCategory.menuDatas.products.map((product, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                        <CommonProductCard
                          product={product}
                          menuType={selectedCategory.menuDatas.menuType}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Container>
          )}
        </Container>

      </Box>
    </>
  );
}

export default DiningOutPage;