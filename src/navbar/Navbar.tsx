import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { paths } from "../routes/path";
import CssBaseline from "@mui/material/CssBaseline";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import React from "react";
import CallIcon from "@mui/icons-material/Call";

const navMenus = [
  {
    name: "Home",
    linkurl: location.pathname === paths.ROOT ? paths.HOME : paths.ROOT,
  },
  { name: "Menu Card", linkurl: paths.MENUS },
  { name: "Daily Menu", linkurl: paths.DAILYMENU },
  { name: "Snacks", linkurl: paths.SNACKS },
  { name: "Catering", linkurl: paths.CATERING },
  { name: "Specials", linkurl: paths.SPECIALS },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMediaQuery("(max-width: 1024px)");

  const isActive = (link: string) => {
    return (
      location.pathname === link ||
      (location.pathname === "/" && link === paths.HOME)
    );
  };

  const theme = useTheme();
  const isBelowSMScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isMobile = matches;

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
    setAppBarPosition("fixed");
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setAppBarPosition("static");
  };

  const [appBarPosition, setAppBarPosition] = React.useState("static");

  React.useEffect(() => {
    if (!matches) {
      setDrawerOpen(false);
    } else {
    }
  }, [matches]);

  const handleMenuClick = (menuName: string) => {
    for (const menu of navMenus) {
      if (menu.name === menuName && menu.linkurl) {
        {
          navigate(menu.linkurl);
          handleDrawerClose();
        }
      }
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setAppBarPosition("fixed");
      } else {
        setAppBarPosition("static");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavigateToHome = () => {
    navigate(paths.HOME);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CssBaseline />
      <AppBar
        sx={{
          zIndex: drawerOpen ? theme.zIndex.drawer + 1 : 1100,
          borderStyle: "solid",
          borderWidth: 0,
          height: "70px",
          backgroundColor: "white",
          position: isBelowSMScreen ? "fixed" : appBarPosition,
          boxShadow: "none",
        }}
        component="nav"
      >
        <Toolbar sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <img
              src="assets/images/output-onlinepngtools (1).png"
              alt="Logo"
              style={{
                height: "auto",
                width: isBelowSMScreen ? "3.5rem" : "3rem",
                marginRight: "6px",

                paddingTop: isBelowSMScreen ? "7px" : "3px",
                paddingLeft: isBelowSMScreen ? "10px" : "0px",
                cursor: "pointer",
              }}
              loading="lazy"
              onClick={handleNavigateToHome}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#038265",
                  fontSize: isBelowSMScreen ? "1.5rem" : "2rem",
                  fontFamily: "clearface ts bold",
                  cursor: "pointer",
                  marginTop: "3px",
                  paddingTop: isBelowSMScreen ? "10px" : "3px",
                }}
                onClick={handleNavigateToHome}
              >
                SINDHU&#8217;S
              </Typography>
              {isBelowSMScreen && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "-7px",
                  }}
                >
                  <CallIcon />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "black",
                      marginLeft: "-25px",
                      marginBottom: "3px",
                    }}
                  >
                    Call us:+1 940-279-2536
                  </Typography>
                </Box>
              )}
            </Box>
            {!isBelowSMScreen && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "30px",
                  marginTop: "6px",
                  color: "black",
                }}
              >
                <CallIcon />
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  &nbsp;Call us : +1 940-279-2536
                </Typography>
              </Box>
            )}
          </Box>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label={drawerOpen ? "close drawer" : "open drawer"}
              edge="end"
              onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
              sx={{ ml: 2, mr: 3, marginTop: "10px" }}
            >
              {drawerOpen ? (
                <CloseIcon sx={{ color: "black", fontSize: "30px" }} />
              ) : (
                <MenuIcon sx={{ color: "black", fontSize: "30px" }} />
              )}
            </IconButton>
          ) : (
            <Box display={"flex"}>
              {navMenus.map((menu, index) => (
                <Box
                  key={menu.name}
                  sx={{
                    position: "relative",
                    marginRight: index < navMenus.length - 1 ? "10px" : "0",
                  }}
                >
                  <Link to={menu.linkurl} style={{ textDecoration: "none" }}>
                    <Button
                      sx={{
                        borderRadius: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "large",
                        textTransform: "none",
                        padding: "1px",
                        backgroundColor: isActive(menu.linkurl)
                          ? theme.palette.primary.main
                          : "none",
                        color: isActive(menu.linkurl) ? "white" : "black",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        px={2}
                      >
                        {menu.name}
                      </Box>
                    </Button>
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {drawerOpen && (
        <Drawer
          anchor="top"
          open={drawerOpen}
          onClose={handleDrawerClose}
          variant="persistent"
          PaperProps={{ elevation: 5 }}
        >
          <Toolbar />

          <List sx={{ width: "inherit" }}>
            {navMenus.map((menu, index) => (
              <ListItem
                key={menu.name}
                sx={{
                  borderBottom:
                    index < navMenus.length - 1
                      ? "1px solid lightgrey"
                      : "none",
                  padding: "2.5px",
                }}
              >
                <Link
                  to={menu.linkurl}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <ListItemButton
                    onClick={() => handleMenuClick(menu.name)}
                    sx={{
                      color: "black",
                      fontSize: "medium",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "0px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      px={2}
                    >
                      {menu.name}
                    </Box>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </Box>
  );
}

export default NavBar;
