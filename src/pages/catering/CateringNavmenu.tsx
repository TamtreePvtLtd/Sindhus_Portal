import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetAllMenusInCatering } from "../../customRQHooks/Hooks";
import Fade from "react-reveal";
import theme from "../../theme/theme";
import {
  IMenuAutoComplete,
  IMenuList,
  IProductAutoComplete,
} from "../../interface/types";

interface MenusProps {
  onSelectMenu: (menuId: string) => void;
  onNavMenuTitleClick: (menuId: string) => void;
  selectedMenuId: string;
  clearProductSearch: () => void;
  setProductValue(value: IProductAutoComplete | null): void;
  setMenuValue(value: IMenuAutoComplete | null): void;
  refetchMenus: () => Promise<void>;
  cateringMenus: IMenuList[];
}

const Menus = ({
  onSelectMenu,
  onNavMenuTitleClick,
  selectedMenuId,
  clearProductSearch,
  setProductValue,
  setMenuValue,
  refetchMenus,
  cateringMenus,
}: MenusProps) => {
  const {
    data: menus,
    isLoading: menusLoading,
    isError: menusError,
    refetch,
  } = useGetAllMenusInCatering();
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [selectedMenuIdState, setSelectedMenuIdState] = useState<string>("");

  useEffect(() => {
    setHoveredMenuId(selectedMenuId);
    setSelectedMenuIdState(selectedMenuId);
    clearProductSearch();
  }, [selectedMenuId]);

  const getMenuItemsInAlphabeticalOrder = () => {
    return menus
      ? [...menus].sort((a, b) => a.title.localeCompare(b.title))
      : [];
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (
      !selectedMenuId ||
      (menus && !menus.find((menu) => menu._id === selectedMenuId))
    ) {
      const menuItems = getMenuItemsInAlphabeticalOrder();
      const sortedMenuItems = [...menuItems].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      const firstMenuItemId =
        sortedMenuItems.length > 0 ? sortedMenuItems[0]._id : "";
      setSelectedMenuIdState(firstMenuItemId);
    } else {
      setSelectedMenuIdState(selectedMenuId);
    }
  }, [selectedMenuId, menus]);

  // const handleMenuClick = (menuId: string) => {
  //   onSelectMenu(menuId);
  //   setSelectedMenuIdState(menuId);
  //   clearProductSearch();
  //   refetchMenus();
  // };

  const handleNavMenuTitleClick = (
    menuId: string,
    cateringMenus: IMenuList[]
  ) => {
    const selectedMenu = cateringMenus.find((menu) => menu._id === menuId);
    if (selectedMenu) {
      onNavMenuTitleClick(menuId);
      setSelectedMenuIdState(menuId);
      clearProductSearch();
      setMenuValue({
        _id: selectedMenu._id,
        title: selectedMenu.title,
        menuType: selectedMenu.menuType,
        label: selectedMenu.title,
      });
      setProductValue(null);
      refetchMenus();
      onSelectMenu("");
    }
  };

  return (
    <>
        {/* {menusLoading && <p>Loading menus...</p>} */}
        {menusError && <p>Error fetching menus</p>}

        {menus && (
          <Grid
          container
          justifyContent="center"
          alignItems="center"
          marginTop="15px"
          marginRight={"-15px"}
          spacing={2}
          >
            {getMenuItemsInAlphabeticalOrder().map((menu) => (
              <Grid
              item
              xs={6}
              sm={6}
              md={3}
              lg={"auto"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              padding={"10px"}
              >
                  <Fade left>
                    <Typography
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        color:
                      selectedMenuIdState === menu._id ||
                      hoveredMenuId === menu._id
                        ? theme.palette.primary.main
                        : "black",
                    textDecoration:
                      selectedMenuIdState === menu._id ||
                      hoveredMenuId === menu._id
                        ? "underline"
                        : "none",
                    textDecorationColor:
                      selectedMenuIdState === menu._id ||
                      hoveredMenuId === menu._id
                        ? theme.palette.primary.main
                        : "none",
                        lineHeight: 1,
                        fontWeight:
                          selectedMenuIdState === menu._id ||
                          hoveredMenuId === menu._id
                            ? 700 
                            : 400, 
                        fontSize: "1.2rem",
                        textTransform: "uppercase",
                        margin:0
                      }}
                      onClick={() => {
                        handleNavMenuTitleClick(menu._id, cateringMenus);
                        onSelectMenu(menu._id);
                      }}
                    >
                      {menu.title}
                    </Typography>
                  </Fade>
              </Grid>
            ))}
          </Grid>
        )}
    </>
  );
};

export default Menus;
