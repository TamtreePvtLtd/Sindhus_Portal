import Box from "@mui/material/Box";
import Slider from "react-slick";
import { ISubMenu } from "../../interface/types";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import { Typography } from "@mui/material";

interface IProps {
  onSubMenuClick(submenuId: string): void;
  snacksSubMenus: ISubMenu[];
  selectedSubMenuId: string;
}

function SnacksMenuItem({
  onSubMenuClick,
  snacksSubMenus,
  selectedSubMenuId,
}: IProps) {
  const theme = useTheme();
  const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5.3,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1,
          arrows: !isBelowMediumScreen,
        },
      },
    ],
  };

  return (
    <Container>
      {snacksSubMenus && snacksSubMenus.length > 0 && (
        <Slider {...settings}>
          <Box sx={{ height: "50px", backgroundColor: "none" }}>
            {/* <Button
              onClick={() => onSubMenuClick("")}
              sx={{
                border: "none",
                borderRadius: "15px",
                width: "140px",
                p: 1,
                color: selectedSubMenuId ? "black" : "white",

                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  border: "none",
                },
                // boxShadow: 2,
              }}
              variant={!selectedSubMenuId ? "contained" : "outlined"}
            > */}
            <Typography
              sx={{
                fontWeight: selectedSubMenuId === "" ? 500 : 300,
                color: selectedSubMenuId === "" ? "black" : "black",
                borderBottom: selectedSubMenuId === "" ? "1px solid #038265" : "none",
                textDecorationColor:
                  selectedSubMenuId === "" ? "#038265" : "none",
                textDecorationThickness: "1.5px",
                textDecorationStyle: "solid",
                paddingBottom: "5px",
                display: "inline-block",
                fontFamily:"Dancing Script, cursive"

              }}
              onClick={() => onSubMenuClick("")}
            >
              All
            </Typography>
            {/* </Button> */}
          </Box>

          {snacksSubMenus.length > 0 &&
            snacksSubMenus.map((subMenu, index) => (
              <Box key={index} sx={{ display: "flex", marginRight: 10 }}>
                <Typography
                  sx={{
                    fontWeight: selectedSubMenuId === subMenu._id ? 500 : 300,
                    color: selectedSubMenuId === subMenu._id ? "" : "inherit",
                    borderBottom:
                      selectedSubMenuId === subMenu._id ? "1px solid #038265" : "none",
                    paddingBottom: "5px",
                    display: "inline-block",
                    fontFamily:"Dancing Script, cursive"

                  }}
                  onClick={() => onSubMenuClick(subMenu._id)}
                >
                  {subMenu.title}
                </Typography>
              </Box>
            ))}
        </Slider>
      )}
    </Container>
  );
}

export default SnacksMenuItem;
