import { Box, Typography } from "@mui/material";
import Bounce from "react-reveal/Bounce";

interface IProps {
  imageUrl: string;
  content: string;
  description?: string;
}
function PageBanner(props: IProps) {
  const { imageUrl, content, description } = props;
  return (
    <>
      <Box
        className="page-banner-area"
        style={{
          backgroundImage: `url(${imageUrl})`,
          height: "15%",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box className="page-banner-content">
          <Bounce left duration={1000}>
            <Typography
              sx={{
                textTransform: "uppercase",
                marginBottom: "0 !important",
              }}
              variant="h2"
              fontWeight={"medium"}
              fontFamily={"Dancing Script, cursive"}
            >
              {content}
            </Typography>
          </Bounce>
        </Box>
        {description && (
          <Box className="page-banner-description">
            <Bounce right duration={1000}>
              <Typography
                sx={{
                  // textTransform: "uppercase",
                  marginBottom: "0 !important",
                }}
                variant="h6"
                fontFamily={"Dancing Script, cursive"}
                fontWeight={"small"}
              >
                {description}
              </Typography>
            </Bounce>
          </Box>
        )}
      </Box>
    </>
  );
}

export default PageBanner;
