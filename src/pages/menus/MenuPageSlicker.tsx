import { Box, Typography } from '@mui/material';
import Fade from "react-reveal/Fade";




export const MenuPageSlicker = () => {
    const imageUrl = 'public/assets/sindhu-kitchen.avif'
    return (
        <div>
            <Box sx={{ position: "relative" }}>
                <Box className="page-banner" style={{ position: "relative", overflow: 'hidden' }}>

                    <img
                        src={imageUrl}
                        alt="Indian Hindu Veg Thali"
                        height='370'
                        width="100%"
                        className="Menu-image"
                        style={{ objectFit: "cover" }}

                    />
                    <Box>
                        <Fade left>
                            <Typography
                                variant="h4"
                                sx={{
                                    position: "absolute",
                                     top: "100%",
                                     left: "35%",
                                    // justifyContent: 'center',
                                    alignItems: 'center',
                                    transform: "translateY(-200%)",
                                    color: "#fff", // Adjust the text color
                                    fontSize: "6rem", // Adjust the text font size

                                    '@media screen and (max-width: 1024px)': {
                                        // Adjust styles for iPad
                                        fontSize: '4rem',
                                        top: '70%',
                                        left: '30%',
                                        // transform: 'translate(-50%, -50%)',
                                    },
                                    '@media screen and (max-width: 600px)': {
                                        // Adjust styles for mobile view
                                        fontSize: '3rem',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        left: '20%',
                                        // transform: 'translate(-50%, -50%)',
                                    },

                                }}
                            >
                                OUR MENU
                            </Typography>

                        </Fade>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
