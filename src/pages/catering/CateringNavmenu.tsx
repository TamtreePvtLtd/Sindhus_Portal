import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetAllMenus, useGetAllMenusInCatering } from "../../customRQHooks/Hooks";
import Fade from "react-reveal";

interface MenusProps {
  onSelectMenu: (menuId: string) => void;
  onNavMenuTitleClick: (menuId: string) => void;
  selectedMenuId: string;
}

const Menus = ({
  onSelectMenu,
  onNavMenuTitleClick,
  selectedMenuId,
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

  const handleMenuClick = (menuId: string) => {
    onSelectMenu(menuId);
    setSelectedMenuIdState(menuId);
  };

  const handleNavMenuTitleClick = (menuId: string) => {
    onNavMenuTitleClick(menuId);
    setSelectedMenuIdState(menuId);
  };

  return (
    <>
      <Box sx={{ paddingTop: "16px" }}>
        {menusLoading && <p>Loading menus...</p>}
        {menusError && <p>Error fetching menus</p>}

        {menus && (
          <Grid
            container
            rowGap={1}
            spacing={2}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "space-around",
                margin: "auto",
              maxWidth: "90%",
            }}
          >
            {getMenuItemsInAlphabeticalOrder().map((menu) => (
              <Grid
                item
                key={menu._id}
                spacing={2}
                xs={6}
                sm={4}
                md={2}
                lg={"auto"}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    paddingX: "20px",
                    cursor: "pointer",
                    color:
                      selectedMenuIdState === menu._id ||
                      hoveredMenuId === menu._id
                        ? "text.primary"
                        : "text.disabled",
                    textDecoration:
                      selectedMenuIdState === menu._id ||
                      hoveredMenuId === menu._id
                        ? "underline"
                        : "none",
                    "&:hover": {
                      color: "text.primary",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => handleMenuClick(menu._id)}
                  onMouseEnter={() => setHoveredMenuId(menu._id)}
                  onMouseLeave={() => setHoveredMenuId(null)}
                >
                  <Fade left>
                    <Typography
                      style={{
                        lineHeight: 1,
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        textTransform: "uppercase",
                      }}
                      onClick={() => {
                        handleNavMenuTitleClick(menu._id);
                        onSelectMenu(menu._id);
                      }}
                    >
                      {menu.title}
                    </Typography>
                  </Fade>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Menus;
