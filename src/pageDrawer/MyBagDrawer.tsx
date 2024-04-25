import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartItem } from "../interface/types";



function MyBagDrawer({ open, onClose }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Retrieve cart items from local storage
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]") as CartItem[];
    setCartItems(storedCartItems);
  }, []);

  
  const handleClearCart = () => {
    localStorage.removeItem("cartItems");
    setCartItems([]);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{ elevation: 5 }}
      sx={{width:"360px",display:"flex",alignItems:"center",justifyContent:"center"}}
    >
      <Grid container  direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2,width:"360px" }}>
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
          <IconButton ><ProductionQuantityLimitsIcon sx={{height:"140px",width:"140px"}}/></IconButton>
          <Typography variant="subtitle1">Your cart is empty</Typography>
          <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
            Go to Shopping
          </Button>
        </Grid>
      ) : ( <>
        <Grid container direction="column" sx={{ p: 2 }}>
          {cartItems.map((item) => (
            <Grid item key={item.productId} sx={{ mb: 2 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item.productId}</Typography>
                  {item.sizes.map((sizeItem) => (
                    <Grid container key={sizeItem.size} direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">{sizeItem.size}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle1">Qty: {sizeItem.qty}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle1">Price: ${sizeItem.price}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <IconButton>
                          <DeleteIcon/>
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