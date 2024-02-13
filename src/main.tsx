import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Loader from "./common/component/Loader.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    <Loader />
  </ThemeProvider>
);
