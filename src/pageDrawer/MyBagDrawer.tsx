import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import {
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

function MybagDrawer({ isOpen, onClose }) {
  const { cartItems, setCartItems } = useCart();

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
      .filter((item) => item !== null); // Remove items marked for deletion
    setCartItems(updatedItems);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "100vw",
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
          height: "calc(100vh - 50px)", // Fill remaining height
        }}
      >
        {cartItems.length === 0 ? (
          <Typography>Your bag is empty.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Item</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Size</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Price</strong>
                  </TableCell>
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
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleIncrement(item.id, item.size)}
                      >
                        +
                      </IconButton>
                      <IconButton
                        onClick={() => handleDecrement(item.id, item.size)}
                        disabled={item.quantity <= 1} // Disable if quantity is 1
                      >
                        -
                      </IconButton>
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
        )}
      </Box>
    </Drawer>
  );
}

export default MybagDrawer;

