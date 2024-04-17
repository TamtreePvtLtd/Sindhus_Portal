import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  IMenuAutoComplete,
  IMenuList,
  IProductAutoComplete,
} from "../../interface/types";
import { useEffect, useState } from "react";
import { useCateringfetchProductData } from "../../customRQHooks/Hooks";
import { Typography } from "@mui/material";

interface IProps {
  onSelectMenu(menuId: string): void;
  onSelectProduct(productId: string): void;
  selectedMenuId: string;
  clearSearch(): void;
  productValue: IProductAutoComplete | null;
  setProductValue(value: IProductAutoComplete | null): void;
  menuValue: IMenuAutoComplete | null;
  setMenuValue(value: IMenuAutoComplete | null): void;
  cateringMenus: IMenuList[];
  refetchMenus: () => Promise<void>;
}

function SearchBar({
  onSelectMenu,
  onSelectProduct,
  selectedMenuId,
  productValue,
  setProductValue,
  menuValue,
  setMenuValue,
  cateringMenus,
  refetchMenus,
}: IProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuClear, setIsMenuClear] = useState(false);
  const [isProductClear, setIsProductClear] = useState(false);
  const [isClearSearchButtonClick, setIsClearButtonClick] = useState(false);

  const { data: cateringProducts, refetch: refetchProductData } =
    useCateringfetchProductData(selectedMenuId, searchTerm);

  const clearSearch = async () => {
    setIsClearButtonClick(true);
    onSelectMenu("");
    onSelectProduct("");
    setMenuValue(null);
    setProductValue(null);
    setSearchTerm("");
    setIsMenuClear(false);
    setIsProductClear(false);
    refetchMenus();

    const menuAutocomplete = document.getElementById("category-autocomplete");
    if (menuAutocomplete) {
      menuAutocomplete.dispatchEvent(new Event("input", { bubbles: true }));
    }

    const foodAutocomplete = document.getElementById("food-autocomplete");
    if (foodAutocomplete) {
      foodAutocomplete.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // const appetizersMenu = cateringMenus.find(
    //   (menu) => menu.title === ""
    // );
    // if (appetizersMenu) {
    //   onSelectMenu(appetizersMenu._id);
    //   setMenuValue({
    //     _id: appetizersMenu._id,
    //     title: appetizersMenu.title,
    //     label: appetizersMenu.title,
    //     menuType: appetizersMenu.menuType,
    //   });
    // }
  };

  useEffect(() => {
    if (selectedMenuId) {
      refetchProductData();
    }

    var timeoutId = 0;

    if (!selectedMenuId && !!searchTerm) {
      timeoutId = setTimeout(() => {
        refetchProductData();
      }, 1000);
    }
    if (!selectedMenuId && !searchTerm) {
      refetchProductData();
    }

    if (isMenuClear || isProductClear) {
      refetchProductData();
      setIsMenuClear(false);
      setIsProductClear(false);
    }

    if (isClearSearchButtonClick) {
      refetchProductData();
      setIsClearButtonClick(false);
    }
    return () => clearTimeout(timeoutId);
  }, [
    selectedMenuId,
    searchTerm,
    isMenuClear,
    isProductClear,
    isClearSearchButtonClick,
  ]);

  const handleProductSearch = async (
    selectedProduct: IProductAutoComplete | null
  ) => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct._id);
      setProductValue(selectedProduct);
    } else {
      onSelectProduct("");
      setProductValue(null);
    }
  };

  const handleMenuChange = (selectedMenu: IMenuAutoComplete | null) => {
    setSearchTerm("");

    if (selectedMenu) {
      setMenuValue(selectedMenu);
      onSelectMenu(selectedMenu._id);
      setProductValue(null);
    } else {
      setMenuValue(null);
      onSelectMenu("");
    }
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} lg={4}>
          <Autocomplete
            id="category-autocomplete"
            value={menuValue}
            getOptionLabel={(option) => option.label}
            options={cateringMenus.map(
              (item) =>
                ({
                  ...item,
                  label: item.title,
                } as IMenuAutoComplete)
            )}
            onChange={(_event, value) => handleMenuChange(value)}
            onInputChange={(_event, newInputValue, reason) => {
              if (!newInputValue.trim()) {
                setMenuValue(null);
                onSelectMenu("");
              }
              if (reason == "clear") {
                setIsMenuClear(true);
              }
            }}
            isOptionEqualToValue={(option, value) =>
              option.title == value.title
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Menu"
                variant="outlined"
                sx={{
                  justifyContent: "center",
                  height: "55px",
                }}
              />
            )}
            sx={{ "& .MuiAutocomplete-inputRoot": { height: "45px" } }}
            renderOption={(props, option) => (
              <li {...props}>
                <Typography style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  {option.title}
                </Typography>
              </li>
            )}
          />
        </Grid>
        <Grid item xs={12} lg={5}>
          <Autocomplete
            id="food-autocomplete"
            value={productValue}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.title == value.title
            }
            onChange={(_event, value) => handleProductSearch(value)}
            options={
              cateringProducts
                ? cateringProducts.map(
                    (item) =>
                      ({
                        ...item,
                        label: item.title,
                      } as IProductAutoComplete)
                  )
                : []
            }
            onInputChange={(_event, newInputValue, reason) => {
              if (!newInputValue.trim()) {
                setProductValue(null);
                onSelectProduct("");
              }

              if (reason == "clear") {
                setSearchTerm("");
                setIsProductClear(true);
              }
            }}
            renderOption={(props, option) => (
              <li {...props}>
                <img
                  src={option.posterURL ?? ""}
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {option.title}
                </Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Food"
                variant="outlined"
                sx={{
                  justifyContent: "center",
                  height: "55px",
                  "& .MuiAutocomplete-inputRoot": { height: "45px" },
                }}
                InputProps={{
                  ...params.InputProps,
                }}
                onChange={(event) => {
                  const newSearchTerm = event.target.value;
                  setSearchTerm(newSearchTerm || "");
                  setProductValue({
                    _id: "",
                    label: newSearchTerm,
                    title: newSearchTerm,
                    posterURL: "",
                  });
                }}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={2}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Button variant="contained" fullWidth onClick={clearSearch}>
            Clear Search
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default SearchBar;
