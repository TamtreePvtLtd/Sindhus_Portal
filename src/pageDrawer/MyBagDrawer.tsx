import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import { useCart } from "../context/CartContext";
import PaymentDialog from "../common/component/PaymentForm";

function MybagDrawer({ isOpen, onClose }) {
  const { cartItems, setCartItems } = useCart();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const taxRate = 8.25 / 100; // Tax rate of 8.25%

  const handleDelete = (id, size) => {
    const updatedItems = cartItems.filter(
      (item) => !(item.id === id && item.size === size)
    );
    setCartItems(updatedItems);
  };

  const handleIncrement = (id, size) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id && item.size === size) {
        const updatedItem = {
          ...item,
          quantity: item.quantity + 1,
          totalPrice: (item.quantity + 1) * item.price,
        };
        return updatedItem;
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleDecrement = (id, size) => {
    const updatedItems = cartItems
      .map((item) => {
        if (item.id === id && item.size === size) {
          const updatedQuantity = item.quantity - 1;
          if (updatedQuantity > 0) {
            const updatedItem = {
              ...item,
              quantity: updatedQuantity,
              totalPrice: updatedQuantity * item.price,
            };
            return updatedItem;
          } else {
            return null; // Mark item for deletion if quantity is 0
          }
        }
        return item;
      })
      .filter((item) => item !== null);
    setCartItems(updatedItems);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const taxAmount = totalAmount * taxRate; // Calculate the tax amount
  const totalWithTax = totalAmount + taxAmount; // Add tax to the total

  const clearCart = () => {
    setCartItems([]); // Clear cart items after successful payment
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: "50%",
            maxWidth: "50vw",
            backgroundColor: "#fff",
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            padding: 2,
            height: "50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            zIndex: 1201,
          }}
        >
          <Typography sx={{ fontSize: "large", fontWeight: 600 }}>
            My Bag
          </Typography>
          <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
        </Box>
        <Divider />
        <Box
          sx={{
            padding: 2,
            overflowY: "auto",
            height: "calc(100vh - 50px - 60px)", // Adjust height to leave space for total amount
          }}
        >
          {cartItems.length === 0 ? (
            <Typography>Your bag is empty.</Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Image</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Item</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Size</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Price</strong>
                      </TableCell>
                      {/* <TableCell>
                        <strong>Total Price</strong>
                      </TableCell> */}
                      <TableCell>
                        <strong>Quantity</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={`${item.id}-${item.size}`}>
                        <TableCell>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }} // Adjust the size of the image as needed
                          />
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        {/* <TableCell>${item.totalPrice.toFixed(2)}</TableCell> */}
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "10px", // Add space between buttons
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                handleIncrement(item.id, item.size)
                              }
                              sx={{
                                border: "1px solid #ddd",
                                borderRadius: "3px",
                                height: "30px", // Adjust button height to fit better
                                width: "30px", // Adjust button width
                              }}
                            >
                              +
                            </IconButton>
                            <Typography
                              sx={{ minWidth: "20px", textAlign: "center" }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                handleDecrement(item.id, item.size)
                              }
                              disabled={item.quantity <= 1}
                              sx={{
                                border: "1px solid #ddd",
                                borderRadius: "3px",
                                height: "30px",
                                width: "30px",
                              }}
                            >
                              -
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDelete(item.id, item.size)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  padding: 2,
                  borderTop: "1px solid #ddd",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 1, // Adds space between the text fields
                }}
              >
                <Typography variant="subtitle1">
                  Total: ${totalAmount.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1">
                  Estimated Tax (8.25%): ${taxAmount.toFixed(2)}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  Total with Tax: ${totalWithTax.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "10px 20px",
                    borderRadius: "4px",
                  }}
                  onClick={() => setIsPaymentDialogOpen(true)} // Open dialog
                >
                  Proceed to Payment
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
      {/* Payment Dialog */}
      <PaymentDialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        amount={totalWithTax.toFixed(2)} // Pass the total with tax
        orderedItems={cartItems}
        clearCart={clearCart}
        closeDrawer={onClose}
      />
    </>
  );
}

export default MybagDrawer;
