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
              variant="h3"
              fontWeight={"bold"}
              fontFamily={"Yeseva One"}
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
                variant="h5"
                fontFamily={"Yeseva One"}
                fontWeight={"bold"}
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
