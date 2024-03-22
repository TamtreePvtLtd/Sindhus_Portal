import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CateringProduct from "./CateringProduct";
import SearchBar from "./SearchBar";
import Fade from "react-reveal/Fade";
import { useEffect, useState } from "react";
import CateringSpecial from "./CateringSpecial";
import { Button } from "@mui/material";
import { RefObject, useRef } from "react";
import Menus from "./CateringNavmenu";
import CateringEnquiryForm from "../../common/component/CateringEnquiryForm";
import {
  IMenuAutoComplete,
  IMenuList,
  IProductAutoComplete,
} from "../../interface/types";
import { queryClient } from "../../App";
import { getAllMenus } from "../../services/api";
import { MenuType } from "../../enums/MenuTypesEnum";

function CateringPage() {
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const footerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);
  const [productValue, setProductValue] = useState<IProductAutoComplete | null>(
    null
  );
  const [menuValue, setMenuValue] = useState<IMenuAutoComplete | null>(null);
  const [cateringMenus, setCateringMenus] = useState<IMenuList[]>([]);
  const menuList = queryClient.getQueryData<IMenuList[]>(["menus"]);

  useEffect(() => {
    if (menuList) {
      setFilteredCateringMenus(menuList);
    } else {
      refetchMenus();
    }
  }, [menuList]);

  const refetchMenus = async () => {
    const _menuList = await queryClient.fetchQuery(["menus"], getAllMenus);
    setFilteredCateringMenus(_menuList);
  };

  const setFilteredCateringMenus = (menuList: IMenuList[]) => {
    var filteredMenus = menuList.filter(
      (menu) => menu.menuType == MenuType.OTHERS
    );

    setCateringMenus([...filteredMenus]);
  };

  const handleEnquiryButtonOpenClick = () => {
    setIsEnquiryFormOpen(true);

    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleEnquiryButtonCloseClick = () => {
    setIsEnquiryFormOpen(false);
  };
  const handleMenuSelection = (menuId: string) => {
    setSelectedMenuId(menuId);
  };

  const handleNavMenuTitleClick = (menuId: string) => {
    setSelectedMenuId(menuId);
  };
  const clearProductSearch = () => {
    setSelectedProductId("");
  };

  const clearSearch = () => {
    setSelectedMenuId("");
    clearProductSearch();
  };

  return (
    <>
      <Box>
        <Box>
          <Fade top>
            <Typography
              variant="h4"
              sx={{
                color: "#038265",
                textAlign: "center",
                padding: "10px",
                fontWeight: 600,
              }}
            ></Typography>
          </Fade>
          <Button
            variant="contained"
            onClick={handleEnquiryButtonOpenClick}
            sx={{
              position: "fixed",
              top: 160,
              right: 0,
              margin: "-55px",
              height: "40px",
              cursor: "pointer",
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
              transform: "rotate(90deg) translate(50%, 50%)",
              zIndex: 99
              
            }}
          >
            Enquire Now
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <CateringSpecial></CateringSpecial>
      </Box>
      <Container sx={{ mt: 2 }}>
        <SearchBar
          onSelectMenu={(menuId: string) => setSelectedMenuId(menuId)}
          onSelectProduct={(productId: string) => {
            setSelectedProductId(productId);
          }}
          selectedMenuId={selectedMenuId}
          clearSearch={clearSearch}
          productValue={productValue}
          setProductValue={setProductValue}
          menuValue={menuValue}
          setMenuValue={setMenuValue}
          cateringMenus={cateringMenus}
          refetchMenus={refetchMenus}
        />
      </Container>
      <Menus
        setMenuValue={setMenuValue}
        setProductValue={setProductValue}
        onSelectMenu={handleMenuSelection}
        onNavMenuTitleClick={handleNavMenuTitleClick}
        selectedMenuId={selectedMenuId}
        clearProductSearch={clearProductSearch}
        refetchMenus={refetchMenus}
        cateringMenus={cateringMenus}
      />
      <CateringProduct
        selectedMenuId={selectedMenuId}
        selectedProductId={selectedProductId}
      />
      {isEnquiryFormOpen && (
        <CateringEnquiryForm
          onClose={handleEnquiryButtonCloseClick}
          isOpen={isEnquiryFormOpen}
        />
      )}
    </>
  );
}

export default CateringPage;
