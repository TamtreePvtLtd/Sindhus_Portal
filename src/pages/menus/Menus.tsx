
import { Box } from '@mui/system';

import { MenuPageSlicker } from './MenuPageSlicker';
import OurMenus from './OurMenus';


const Menus = () => {

    return (
        <>

            <Box
                sx={{
                    position: 'relative',
                    // minHeight: '100vh', // Set minimum height to cover the entire viewport
                }}
            >
                <MenuPageSlicker />
            </Box>

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1, // Ensure the content is above the background image
                    mb: 3,
                    // pt: '150px
                    
                }}
            >
                <OurMenus />
            </Box>

        </>
    );
}

export default Menus;
