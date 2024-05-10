import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { httpWithoutCredentials } from "../services/http";

interface CartItem {
  productId: string;
  title: string;
  posterURL: string;
  sizes: { size: string; qty: number; price: number }[];
}

function MyBagDrawer({ open, onClose }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const promises = storedCartItems.map(() => httpWithoutCredentials.get(`/product/getMyBag`));
        const responses = await Promise.all(promises);
        const updatedCartItems = responses.map((response, index) => {
          const productData = response.data;
          const updatedItem = {
            ...storedCartItems[index],
            title: productData.title,
            posterURL: productData.posterURL,
            sizes: storedCartItems[index].sizes.map((size: { size: any; }) => ({
              ...size,
              price: productData.itemSizeWithPrice?.find((item: { size: any; }) => item.size === size.size)?.price || 0
            }))
          };
          return updatedItem;
        });
        setCartItems(updatedCartItems);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, []);

  const handleClearCart = () => {
    localStorage.removeItem("cartItems");
    setCartItems([]);
    setTotalItems(0);
    setTotalPrice(0);
  };

  const handleDeleteItem = (productId) => {
    const updatedCartItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    calculateTotal(updatedCartItems);
  };

  const handleQuantityChange = (productId: string, size: string, newQty: number) => {
    const updatedCartItems:CartItem[]  = cartItems.map(item => {
      if (item.productId === productId) {
        const updatedSizes = item.sizes.map(s => {
          if (s.size === size) {
            return { ...s, qty: newQty };
          }
          return s;
        });
        return { ...item, sizes: updatedSizes };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    calculateTotal(updatedCartItems);
  };

  const calculateTotal = (items) => {
    const totalItemsCount = items.reduce((acc: any, curr: { sizes: any[]; }) => acc + curr.sizes.reduce((a, c) => a + c.qty, 0), 0);
    const totalPrice = items.reduce((acc: any, curr: { sizes: any[]; }) => acc + curr.sizes.reduce((a: number, c: { qty: number; price: number; }) => a + (c.qty * c.price), 0), 0);
    setTotalItems(totalItemsCount);
    setTotalPrice(totalPrice);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{ elevation: 5 }}
      sx={{ width: "360px", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, width: "360px" }}>
        <Grid item>
          <Typography variant="h6">My Bag</Typography>
        </Grid>
        <Grid item>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>

      {cartItems.length === 0 ? (
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ mt: 15 }}>
          <IconButton ><ProductionQuantityLimitsIcon sx={{ height: "140px", width: "140px" }} /></IconButton>
          <Typography variant="subtitle1">Your cart is empty</Typography>
          <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
            Go to Shopping
          </Button>
        </Grid>
      ) : (
        <>
          <Grid container direction="column" sx={{ p: 2 }}>
            {cartItems.map((item) => (
              <Grid item key={item.productId} sx={{ mb: 2 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                    <img src={item.posterURL} alt={item.title} style={{ maxWidth: "100%", height: "auto" }} />
                    {item.sizes.map((sizeItem) => (
                      <Grid container key={sizeItem.size} direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">{sizeItem.size}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <ButtonGroup>
                            <Button onClick={() => handleQuantityChange(item.productId, sizeItem.size, sizeItem.qty - 1)}>-</Button>
                            <Button>{sizeItem.qty}</Button>
                            <Button onClick={() => handleQuantityChange(item.productId, sizeItem.size, sizeItem.qty + 1)}>+</Button>
                          </ButtonGroup>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1">Price: ${sizeItem.price}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <IconButton onClick={() => handleDeleteItem(item.productId)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Items: {totalItems}</Typography>
            <Typography variant="subtitle1">Total Price: ${totalPrice}</Typography>
            <Button variant="outlined" color="secondary" onClick={handleClearCart} sx={{ mt: 2, mb: 1 }}>
              Clear Cart
            </Button>
            <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 1 }}>
              Proceed to Checkout
            </Button>
          </Grid>
        </>
      )}
    </Drawer>
  );
}

export default MyBagDrawer;
