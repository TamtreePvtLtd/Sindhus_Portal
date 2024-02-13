import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
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
  { name: "Home", linkurl: paths.HOME },
  { name: "Specials", linkurl: paths.SPECIALS },
  { name: "Daily Menu", linkurl: paths.DAILYMENU },
  { name: "Snacks", linkurl: paths.SNACKS },
  { name: "Catering", linkurl: paths.CATERING },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMediaQuery("(max-width: 1024px)");

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
    <Box>
      <CssBaseline />
      <AppBar
        sx={{
          zIndex: drawerOpen ? theme.zIndex.drawer + 1 : 1100,
          //backdropFilter: "blur(20px)",
          borderStyle: "solid",
          borderWidth: 0,
          height: "70px",
          //backgroundColor: "rgba(255,255,255,0.7)",
          backgroundColor: "white",
          position: isBelowSMScreen ? "fixed" : appBarPosition,
        }}
        component="nav"
      >
        <Container maxWidth={false}>
          <Toolbar sx={{ p: 0, height: "35px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <img
                src="assets/images/sindhus-logo.png"
                alt="Logo"
                style={{
                  height: "auto",
                  width: isBelowSMScreen ? "3.5rem" : "4rem",
                  marginRight: "10px",
                  paddingTop: "10px",
                  paddingBottom: "5px",
                  cursor: "pointer",
                }}
                loading="lazy"
                onClick={handleNavigateToHome}
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    fontSize: isBelowSMScreen ? "1.5rem" : "2rem",
                    fontFamily: "Sindhus-Logo-Font",
                    cursor: "pointer",
                  }}
                  onClick={handleNavigateToHome}
                >
                  SINDHU&#8217;S
                </Typography>
                {isBelowSMScreen && (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CallIcon />
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      &nbsp; Call us:+1 940-279-2536
                    </Typography>
                  </Box>
                )}
              </Box>
              {!isBelowSMScreen && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "20px",
                  }}
                >
                  <CallIcon />
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    &nbsp; Call us : +1 940-279-2536
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
                sx={{ ml: 2 }}
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
                          backgroundColor:
                            location.pathname === menu.linkurl
                              ? theme.palette.primary.main
                              : "none",
                          color:
                            location.pathname === menu.linkurl
                              ? "white"
                              : "black",
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
        </Container>
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
                      padding: 0,
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
