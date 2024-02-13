import createTheme from "@mui/material/styles/createTheme";
import red from "@mui/material/colors/red";

const theme = createTheme({
  palette: {
    primary: {
      main: "#57ccb5",
    },
    secondary: {
      main: "#efcb6b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 500,
      textDecoration: "none",
      color: "#fff",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: "#57ccb5",
        },
        contained: {
          color: "white",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          width: "30px",
          height: "30px",
          color: "white",
        },
      },
    },
  },
});

export default theme;
