import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  drawerContainer: {
    padding: "16px",
    height: "100%",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  drawerContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  posterImage: {
    width: "100px",
    height: "100px",
  },
}));

export default useStyles;
