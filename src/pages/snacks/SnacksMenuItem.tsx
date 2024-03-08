import Box from "@mui/material/Box";
// import Slider from "react-slick";
import { ISubMenu } from "../../interface/types";
// import Button from "@mui/material/Button";
// import Container from "@mui/material/Container";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import useTheme from "@mui/material/styles/useTheme";
import { Grid, Typography } from "@mui/material";

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
  // const theme = useTheme();
  // const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const settings = {
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 5.3,
  //   slidesToScroll: 4,
  //   initialSlide: 0,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 4.5,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 3.5,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 2.1,
  //         slidesToScroll: 1,
  //         arrows: !isBelowMediumScreen,
  //       },
  //     },
  //   ],
  // };

  return (
    <>
      {snacksSubMenus && snacksSubMenus.length > 0 && (
          <Grid display={"flex"} flexDirection={"row"}  justifyContent={"center"} alignItems={"center"} columnGap={4}>  
          
          <Box>
            <Typography
              sx={{
                fontWeight: selectedSubMenuId === "" ? 700 : 500,
                color:
                  selectedSubMenuId === "" ? "text.primary" : "text.disabled",
                borderBottom:
                  selectedSubMenuId === "" ? "1px solid #038265" : "none",
                textDecorationColor:
                  selectedSubMenuId === "" ? "#038265" : "none",
                textDecorationThickness: "1.5px",
                textDecorationStyle: "solid",
                display: "inline-block",
                fontFamily: "revert-layer",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: "2",
              }}
              onClick={() => onSubMenuClick("")}
            >
              All
            </Typography>
          </Box>

          {snacksSubMenus.length > 0 &&
            snacksSubMenus.map((subMenu) => (
              <Box>
                <Typography
                  sx={{
                    fontWeight: selectedSubMenuId === subMenu._id ? 700 : 500,
                    color:
                      selectedSubMenuId === subMenu._id
                        ? "text.primary"
                        : "text.disabled",
                    borderBottom:
                      selectedSubMenuId === subMenu._id
                        ? "1px solid #038265"
                        : "none",
                    margin: 0,
                    lineHeight: "2",   
                    fontFamily: "revert-layer",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    display: "inline-block",
                    textDecoration: "none", // Remove underline by default
                    "&:hover": {
                      // Apply styles on hover
                      color: "black",
                    },
                  }}
                  onClick={() => onSubMenuClick(subMenu._id)}
                >
                  {subMenu.title}
                </Typography>
              </Box>
            ))}
    </Grid>
      )}
    </>
  );
}

export default SnacksMenuItem;
