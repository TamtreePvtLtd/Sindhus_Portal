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
} from "@mui/material";

interface IDeleteConfirmationDialogProps {
  deleteConfirmationOpen: boolean;
  handleDeleteConfirmationClose: () => void;
  handleDeleteConfirmation: () => void;
  title: string;
  content: string;
}
function DeleteConfirmationDialog(props: IDeleteConfirmationDialogProps) {
  const {
    deleteConfirmationOpen,
    handleDeleteConfirmationClose,
    handleDeleteConfirmation,
    title,
    content,
  } = props;

  return (
    <>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle sx={{ backgroundColor: "#ece7ee" }}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography sx={{ fontWeight: 700 }} color="primary">
              {title}
            </Typography>
            <CloseIcon
              color="primary"
              onClick={handleDeleteConfirmationClose}
            ></CloseIcon>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDeleteConfirmationClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDeleteConfirmation}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteConfirmationDialog;
