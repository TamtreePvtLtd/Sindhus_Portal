import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';
import { useEffect } from 'react';

const GoogleReviewsModal = ({ open, onClose }) => {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://static.elfsight.com/platform/platform.js";
        script.defer = true;
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth >
      <Box
        sx={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height:"80vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            
          }}
        >
          <DialogTitle>Google Reviews</DialogTitle>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent >
          <Typography marginTop={"-20px"}>
          <div className="elfsight-app-bb76dbc3-00fe-4dd0-b895-472550dc1168" data-elfsight-app-lazy></div>
          </Typography>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default GoogleReviewsModal;
