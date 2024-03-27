import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography, Card, CardContent, Grid } from '@mui/material';
import '../../styles/GoogleReview.css'; 

const GoogleReviewsModal = ({ open, onClose }) => {
    const mockReviews = [
        {
            id: 1,
            author: 'John Doe',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            rating: 5
        },
        {
            id: 2,
            author: 'Jane Smith',
            review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            rating: 3
        }, {
            id: 3,
            author: 'John Doe',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            rating: 5
        },
        {
            id: 4,
            author: 'Jane Smith',
            review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            rating: 4
        },
        {
            id: 5,
            author: 'John Doe',
            review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            rating: 5
        },
        {
            id: 6,
            author: 'Jane Smith',
            review: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            rating: 4
        },
    ];

    const renderRatingStars = (rating: number): React.ReactNode => {
        const stars: React.ReactNode[] = [];
        for (let i = 1; i <= 5; i++) {
            const fillClass = i <= rating ? 'rating-stars' : 'empty-star';
            stars.push(
                <span key={i} className={fillClass}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth className='google-review-modal'>
            <Box sx={{ zIndex: 1, display: "flex", flexDirection: "column", height: "80vh" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <DialogTitle>What our Customers Say</DialogTitle>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent>
                    <Grid container spacing={2}>
                        {mockReviews.map(review => (
                            <Grid item xs={12} sm={6} key={review.id}>
                                <Card sx={{border:"1px solid #ccc",borderRadius:"8px",width:"100%",height:"100%"}} >
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{fontWeight:"bold"}}>{review.author}</Typography>
                                        <Typography variant="body2">
                                            {renderRatingStars(review.rating)}
                                        </Typography>
                                        <Typography variant="body1">{review.review}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default GoogleReviewsModal;
