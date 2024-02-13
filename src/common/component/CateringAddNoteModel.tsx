import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ISelectedCateringProduct } from "../../interface/types";

interface IAddNoteProps {
  isAddNotePopupOpen: boolean;
  handleAddNotePopupClose: () => void;
  onAddNote: (note: string) => void;
  selectedProduct: ISelectedCateringProduct | null;
  addNotes: { [productId: string]: string };
}
function CateringAddNoteModel(props: IAddNoteProps) {
  const {
    isAddNotePopupOpen: open,
    handleAddNotePopupClose: onClose,
    onAddNote,
    selectedProduct,
    addNotes,
  } = props;

  const [note, setNote] = useState("");

  useEffect(() => {
    if (selectedProduct) {
      setNote(addNotes[selectedProduct._id] || "");
    }
  }, [selectedProduct, addNotes]);

  const handleAddNote = () => {
    onAddNote(note);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#ece7ee" }}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: "1.2rem" }}
              color="primary"
            >
              Add Note
            </Typography>
            <CloseIcon color="primary" onClick={onClose}></CloseIcon>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedProduct && (
            <>
              <Typography sx={{ mb: 1, fontSize: "1.2rem" }}>
                <b>{`${selectedProduct.title}`}</b>
              </Typography>
            </>
          )}
          <Typography variant="subtitle1">Write note</Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={6}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAddNote}>
            Add Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CateringAddNoteModel;
