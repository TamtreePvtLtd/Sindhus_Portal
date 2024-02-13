import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getCateringBag } from "../../services/api";
import {
  ICateringMenu,
  ISelectedCateringProduct,
  IServingSizeWithQuantity,
} from "../../interface/types";
import CateringSelectedProductDrawer from "../../pageDrawer/CateringSelectedProductDrawer";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
import NoProductsAvailable from "../../common/component/NoProductsAvailable";
import { useGetProductByCateringMenu } from "../../customRQHooks/Hooks";
import { paths } from "../../routes/path";

interface IProps {
  selectedMenuId: string;
  selectedProductId: string;
}

function CateringProduct({ selectedMenuId, selectedProductId }: IProps) {
  const [cateringData, setCateringData] = useState<ICateringMenu[]>([]);
  const [productQuantities, setProductQuantities] = useState<
    IServingSizeWithQuantity[]
  >([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [productInfo, setProductInfo] = useState<ISelectedCateringProduct[]>(
    []
  );
  const [badgeContent, setBadgeContent] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { data: cateringResponse, refetch: refetchProducts } =
    useGetProductByCateringMenu(selectedMenuId, selectedProductId, pageNum);

  useEffect(() => {
    if (cateringResponse && cateringResponse.items) {
      if (!selectedMenuId && !selectedProductId && pageNum >= 1) {
        if (pageNum == 1) {
          setCateringData([...cateringResponse.items]);
        } else if (pageNum > 1) {
          var result = [...cateringData, ...cateringResponse.items];
          setCateringData([...result]);
        }
      } else {
        setCateringData([...cateringResponse.items]);
      }
      setHasMore(
        cateringResponse.pageInfo.totalPages > cateringResponse.pageInfo.page
      );
    }
  }, [cateringResponse?.items]);

  useEffect(() => {
    if (pageNum > 0) refetchProducts();

    if (pageNum <= 0 && (selectedMenuId != "" || selectedProductId != "")) {
      refetchProducts();
    }
  }, [pageNum]);

  const observer: any = useRef();

  const lastElementRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (selectedProductId != "") {
      setPageNum(0);
    } else if (selectedMenuId != "") {
      setPageNum(-1);
    } else {
      setPageNum(1);
    }
  }, [selectedMenuId, selectedProductId]);

  useEffect(() => {
    const ProductIds = new Set<string>();
    productQuantities.forEach((item) => {
      if (item.sizes.some((size) => size.qty > 0)) {
        ProductIds.add(item.productId);
      }
    });

    setBadgeContent(ProductIds.size);
  }, [productQuantities]);

  const handleDecrement = (productId, trayItem) => {
    setProductQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const productIndex = updatedQuantities.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex === -1) {
        updatedQuantities.push({
          productId,
          sizes: [{ size: trayItem, qty: Math.max(0, 0) }],
        });
      } else {
        const existingSizes = updatedQuantities[productIndex].sizes;
        const sizeIndex = existingSizes.findIndex(
          (size) => size.size === trayItem
        );

        if (sizeIndex === -1) {
          existingSizes.push({ size: trayItem, qty: Math.max(0, 0) });
        } else {
          existingSizes[sizeIndex].qty = Math.max(
            existingSizes[sizeIndex].qty - 1,
            0
          );
        }
      }

      return updatedQuantities;
    });
  };

  const handleIncrement = (productId, trayItem) => {
    setProductQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const productIndex = updatedQuantities.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex === -1) {
        updatedQuantities.push({
          productId,
          sizes: [{ size: trayItem, qty: 1 }],
        });
      } else {
        const existingSizes = updatedQuantities[productIndex].sizes;
        const sizeIndex = existingSizes.findIndex(
          (size) => size.size === trayItem
        );

        if (sizeIndex === -1) {
          existingSizes.push({ size: trayItem, qty: 1 });
        } else {
          existingSizes[sizeIndex].qty = existingSizes[sizeIndex].qty + 1;
        }
      }

      return updatedQuantities;
    });
  };

  const handleSubmit = async () => {
    try {
      const productIds = productQuantities.map((item) => item.productId);

      const response = await getCateringBag(productIds);
      setProductInfo(response);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCloseModal = () => {
    setDrawerOpen(false);
  };

  const removeCateringProduct = (productId: string) => {
    setProductInfo((prevProductInfo) =>
      prevProductInfo.filter((product) => product._id !== productId)
    );

    setProductQuantities((prevQuantities) =>
      prevQuantities.filter((item) => item.productId !== productId)
    );
  };

  const resetQuantityState = () => {
    setProductQuantities([]);
  };

  return (
    <>
      <Container>
        {cateringData.length === 0 ? (
          <NoProductsAvailable />
        ) : (
          cateringData &&
          cateringData.length > 0 &&
          cateringData.map((data) => (
            <Box key={data._id}>
              <Typography
                sx={{
                  textAlign: "center",
                  color: "white",
                  backgroundColor: "orange",
                  my: 2,
                  fontSize: "2rem",
                }}
              >
                {data.menuTitle}
              </Typography>

              <Grid container spacing={3}>
                {data.products &&
                  data.products.length > 0 &&
                  data.products.map((product, index) => (
                    <Grid
                      container
                      item
                      key={product._id}
                      sx={{
                        borderBottom:
                          index === data.products.length - 1
                            ? "none"
                            : "1px solid #FFD580",
                        mt: 2,
                      }}
                    >
                      <Grid item xs={12} lg={3}>
                        <Link
                          to={`/detail/${product._id}`}
                          state={{ previousPath: paths.CATERING }}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          <img
                            src={product.posterURL}
                            width={"100%"}
                            height={"80%"}
                            alt={product.title}
                            loading="lazy"
                          />
                        </Link>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        lg={5}
                        sx={{
                          paddingLeft: "20px",
                          mt: { xs: -2, md: 0 },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "600",
                            fontSize: "1.5rem",
                            marginBottom: "8px",
                          }}
                        >
                          {product.title}
                        </Typography>

                        <Typography>{product.description}</Typography>

                        {product.servingSizeDescription && (
                          <Typography sx={{ mt: 2 }}>
                            <b>ServingSize-Description</b>
                            <Typography
                              sx={{
                                whiteSpace: "pre-line",
                              }}
                            >
                              {product.servingSizeDescription}
                            </Typography>
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        {product.cateringMenuSizeWithPrice &&
                          product.cateringMenuSizeWithPrice.length > 0 && (
                            <TableContainer>
                              <Table aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">
                                      <strong>Serving Size(s)</strong>
                                    </TableCell>
                                    <TableCell align="center">
                                      <strong>Quantity</strong>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {product.cateringMenuSizeWithPrice.map(
                                    (trayItem) => (
                                      <TableRow
                                        key={trayItem.size}
                                        sx={{
                                          "&:last-child td, &:last-child th": {
                                            border: 0,
                                          },
                                        }}
                                      >
                                        <TableCell
                                          component="th"
                                          scope="row"
                                          align="center"
                                          sx={{
                                            whiteSpace: "pre-line",
                                          }}
                                        >
                                          {trayItem.size}&nbsp;
                                          <b>[${trayItem.price}]</b>
                                        </TableCell>

                                        <TableCell>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                            }}
                                          >
                                            <ButtonGroup
                                              className="test"
                                              sx={{
                                                lineHeight: 1,
                                                padding: 0,
                                                "& .MuiButtonGroup-grouped": {
                                                  minWidth: "32px",
                                                },
                                                marginLeft: "8px",
                                              }}
                                              size="small"
                                              aria-label="small outlined button group"
                                            >
                                              <Button
                                                color="primary"
                                                sx={{
                                                  lineHeight: 1,
                                                  padding: 0,
                                                  "& .MuiButtonGroup-grouped": {
                                                    minWidth: "32px !important",
                                                  },
                                                }}
                                                size="small"
                                                aria-label="small outlined button group"
                                                onClick={() =>
                                                  handleDecrement(
                                                    product._id,
                                                    trayItem.size
                                                  )
                                                }
                                              >
                                                -
                                              </Button>
                                              <Button
                                                sx={{
                                                  lineHeight: 1.3,
                                                  fontWeight: 600,
                                                  color: "black !important",
                                                }}
                                                disabled
                                              >
                                                {(productQuantities &&
                                                  productQuantities.length >
                                                    0 &&
                                                  productQuantities
                                                    .find(
                                                      (item) =>
                                                        item.productId ===
                                                        product._id
                                                    )
                                                    ?.sizes.find(
                                                      (size) =>
                                                        size.size ===
                                                        trayItem.size
                                                    )?.qty) ||
                                                  0}
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleIncrement(
                                                    product._id,
                                                    trayItem.size
                                                  )
                                                }
                                                sx={{
                                                  lineHeight: 1.3,
                                                }}
                                              >
                                                +
                                              </Button>
                                            </ButtonGroup>
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))
        )}

        {!selectedMenuId && !selectedProductId && (
          <Box
            ref={
              cateringResponse?.pageInfo.page ??
              0 < (cateringResponse?.pageInfo.totalPages ?? 0)
                ? lastElementRef
                : null
            }
          ></Box>
        )}
      </Container>

      {!!badgeContent && (
        <Box
          sx={{
            zIndex: 1,
            bottom: 20,
            left: "20px",
            position: "sticky",
            display: "flex",
            justifyContent: "flex-end",
            mx: 4,
            my: 5,
            transform: "all 0.2s",
          }}
        >
          <Fade bottom>
            <Badge badgeContent={badgeContent} color="primary">
              <LocalDiningOutlinedIcon
                sx={{
                  cursor: "pointer",
                  color: "white",
                  borderRadius: "50%",
                  backgroundColor: "black",
                  padding: "5px",
                  borderColor: "white",
                  boxShadow: "0 0 0 2px white, 0 0 0 4px black",
                  fontSize: "3rem",
                }}
                onClick={handleSubmit}
              />
            </Badge>
          </Fade>
        </Box>
      )}

      <CateringSelectedProductDrawer
        isOpen={isDrawerOpen}
        handleClose={handleCloseModal}
        productInfo={productInfo}
        productQuantities={productQuantities}
        removeCateringProduct={removeCateringProduct}
        resetQuantityState={resetQuantityState}
      />
    </>
  );
}

export default CateringProduct;
