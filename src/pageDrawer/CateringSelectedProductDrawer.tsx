import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import {
  ISelectedCateringProduct,
  IServingSizeWithQuantity,
} from "../interface/types";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import { useState } from "react";
import CateringRequestModel from "../common/component/CateringRequestModel";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "../common/component/CommonDeleteConfirmationDialog";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CateringAddNoteModel from "../common/component/CateringAddNoteModel";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  productInfo: ISelectedCateringProduct[];
  productQuantities: IServingSizeWithQuantity[];
  removeCateringProduct: (productId: string) => void;
  resetQuantityState: () => void;
}

function CateringSelectedProductDrawer(props: IProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddNotePopupOpen, setIsAddNotePopupOpen] = useState(false);

  const theme = useTheme();
  const {
    isOpen,
    handleClose,
    productInfo,
    productQuantities,
    removeCateringProduct,
    resetQuantityState,
  } = props;
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] =
    useState<ISelectedCateringProduct | null>(null);
  const [addNotes, setAddNotes] = useState<{ [productId: string]: string }>({});

  const isBelowMediumSize = useMediaQuery(theme.breakpoints.down("md"));

  const handleSendNowClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleAddNoteIconClick = (product: ISelectedCateringProduct) => {
    setSelectedProduct(product);
    setIsAddNotePopupOpen(true);
  };

  const handleAddNotePopupClose = () => {
    setIsAddNotePopupOpen(false);
  };

  const handleAddNote = (enteredNote: string) => {
    if (selectedProduct) {
      setAddNotes((prevNotes) => ({
        ...prevNotes,
        [selectedProduct._id]: enteredNote,
      }));
      setSelectedProduct(null);
    }
    setIsAddNotePopupOpen(false);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteProduct = (product: ISelectedCateringProduct) => {
    setProductIdToDelete(product._id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = () => {
    if (productIdToDelete) {
      removeCateringProduct(productIdToDelete);
      setProductIdToDelete(null);
    }
    setDeleteConfirmationOpen(false);
  };

  const handleCateringRequestSubmit = () => {
    resetQuantityState();
    handleClose();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        PaperProps={{
          sx: {
            width: isBelowMediumSize ? "100vw" : "38vw",
            height: "100vh",
          },
        }}
        sx={{
          position: "relative",
        }}
      >
        <>
          <Box
            sx={{
              padding: 2,
              height: "50px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Catering Request List
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Container>
            {productInfo.length > 0 &&
              productInfo.map((product, index) => (
                <Box
                  my={1}
                  key={index}
                  sx={{
                    borderBottom:
                      index === productInfo.length - 1
                        ? "none"
                        : "1px solid #eeeeee",
                  }}
                >
                  <Card
                    sx={{
                      minHeight: "9rem",
                    }}
                    elevation={0}
                  >
                    <Grid
                      container
                      spacing={2}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Grid item xs={4}>
                        <CardMedia
                          sx={{
                            width: "100%",
                            height: "100%",
                          }}
                          image={product.posterURL}
                          component={"img"}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "large",
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.title}
                          </Typography>
                          {productQuantities.length > 0 &&
                            productQuantities.map(
                              (item) =>
                                item.productId === product._id && (
                                  <Box key={item.productId}>
                                    <TableContainer>
                                      <Table sx={{ width: "80%" }}>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell
                                              style={{
                                                padding: 1,
                                              }}
                                            >
                                              Size
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                padding: 1,
                                              }}
                                            >
                                              Quantity
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {item.sizes.map((sizeInfo) => (
                                            <TableRow key={sizeInfo.size}>
                                              <TableCell
                                                style={{
                                                  padding: 1,
                                                }}
                                              >
                                                {sizeInfo.size}
                                              </TableCell>
                                              <TableCell
                                                style={{
                                                  padding: 1,
                                                }}
                                              >
                                                {sizeInfo.qty}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </Box>
                                )
                            )}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            my: 3,
                            mr: 2,
                          }}
                        >
                          <NoteAddIcon
                            sx={{ cursor: "pointer", fontSize: 30 }}
                            onClick={() => handleAddNoteIconClick(product)}
                          ></NoteAddIcon>
                          <DeleteIcon
                            sx={{ cursor: "pointer", fontSize: 30 }}
                            onClick={() => handleDeleteProduct(product)}
                          ></DeleteIcon>
                        </Box>
                      </Grid>
                    </Grid>
                    {addNotes[product._id] && (
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 500, fontSize: "17px" }}
                        >
                          notes:
                        </Typography>
                        <Typography sx={{ fontSize: "14px" }}>
                          {addNotes[product._id]}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Box>
              ))}
          </Container>
        </>
        {productInfo.length > 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              bottom: 20,
            }}
          >
            <Button variant="contained" onClick={handleSendNowClick}>
              Send Now
            </Button>
          </Box>
        )}
      </Drawer>

      <CateringRequestModel
        open={isPopupOpen}
        onClose={handlePopupClose}
        productInfo={productInfo}
        productQuantities={productQuantities}
        addNotes={addNotes}
        onRequestSubmit={handleCateringRequestSubmit}
      />

      <CateringAddNoteModel
        isAddNotePopupOpen={isAddNotePopupOpen}
        handleAddNotePopupClose={handleAddNotePopupClose}
        onAddNote={handleAddNote}
        selectedProduct={selectedProduct}
        addNotes={addNotes}
      />

      <DeleteConfirmationDialog
        title="Remove Product"
        content="Are you sure you want to remove this product?"
        deleteConfirmationOpen={deleteConfirmationOpen}
        handleDeleteConfirmationClose={handleDeleteConfirmationClose}
        handleDeleteConfirmation={handleDeleteConfirmation}
      />
    </>
  );
}

export default CateringSelectedProductDrawer;
