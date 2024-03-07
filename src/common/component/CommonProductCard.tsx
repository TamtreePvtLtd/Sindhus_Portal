import { useState } from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router-dom";
import { paths } from "../../routes/path";
import { IProductCardList } from "../../interface/types";

interface IProps {
  product: IProductCardList;
}

function CommonProductCard(props: IProps) {
  const { product } = props;
  const [selectedSize, setSelectedSize] = useState(
    product.dailyMenuSizeWithPrice?.[0]?.size || ""
  );

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <Card
      sx={{
        mr: 2,
        width: "200px",
        height: "260px",
        border: "1px solid #ddd",
        background: "#fff",
        boxShadow: "none",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          height: "65%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Link
          to={`/detail/${product._id}`}
          state={{ previousPath: paths.DAILYMENU }}
          style={{ textDecoration: "none" }}
        >
          <CardMedia
            component="img"
            src={product.posterURL}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "transform 400ms",
            }}
            loading="lazy"
          />
        </Link>
      </Box>

      <CardContent sx={{ height: "35%", overflow: "hidden" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2,
          }}
          component="div"
        >
          {product.title}
        </Typography>

        <Box>
          {product.dailyMenuSizeWithPrice &&
            product.dailyMenuSizeWithPrice.length > 0 && (
              <select
                value={selectedSize}
                onChange={(e) => handleSizeClick(e.target.value)}
                style={{
                  padding: "5px",
                  marginTop: "5px",
                  borderRadius: "30px",
                  
                }}
              >
                {product.dailyMenuSizeWithPrice.map((sizePrice) => (
                  <option key={sizePrice.size} value={sizePrice.size}>
                    {sizePrice.size} - ${sizePrice.price}
                  </option>
                ))}
              </select>
            )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonProductCard;
