import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetAllMenus } from '../../customRQHooks/Hooks';
import Fade from "react-reveal";

interface MenusProps {
    onSelectMenu: (menuId: string) => void;
    onNavMenuTitleClick: (menuId: string) => void; // Define the prop here
}

const Menus = ({ onSelectMenu, onNavMenuTitleClick }: MenusProps) => {
    const { data: menus, isLoading: menusLoading, isError: menusError } = useGetAllMenus();
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>("");
    const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);

    const getMenuItemsInAlphabeticalOrder = () => {
        return menus ? [...menus].sort((a, b) => a.title.localeCompare(b.title)) : [];
    };

    useEffect(() => {
        // Find the ID of the "Appetizers" menu and set it as the initial selectedMenuId
        const appetizersMenuId = getMenuItemsInAlphabeticalOrder().find(menu => menu.title === 'Appetizers')?._id;
        setSelectedMenuId(appetizersMenuId || "");
        onSelectMenu(appetizersMenuId || "");
    }, [menus, onSelectMenu]);

    const handleMenuClick = (menuId: string) => {
        setSelectedMenuId(menuId);
        onSelectMenu(menuId);
    };

    const handleNavMenuTitleClick = (menuId: string) => {
        setSelectedMenuId(menuId);
        onNavMenuTitleClick(menuId); // Invoke the onNavMenuTitleClick function
    };

    return (
        <>
            <Box sx={{ paddingTop: '10px' }}>
                {menusLoading && <p>Loading menus...</p>}
                {menusError && <p>Error fetching menus</p>}

                {menus && (
                    <Grid container spacing={1} sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'flex-start'
                    }}>

                        {getMenuItemsInAlphabeticalOrder().map((menu,) => (
                            <Grid item key={menu._id} columnGap={4} xs={12} sm={6} md={3} lg={'auto'} >
                                <Box
                                    sx={{
                                        gap: 4,
                                        marginTop: '5px',
                                        textAlign: 'center',
                                        paddingX: '20px',
                                        cursor: 'pointer',
                                        color: (selectedMenuId === menu._id || hoveredMenuId === menu._id) ? 'text.primary' : 'text.disabled',
                                        textDecoration: (selectedMenuId === menu._id || hoveredMenuId === menu._id) ? 'underline' : 'none',
                                        '&:hover': {
                                            color: 'text.primary',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                    onClick={() => handleMenuClick(menu._id)}
                                    onMouseEnter={() => setHoveredMenuId(menu._id)}
                                    onMouseLeave={() => setHoveredMenuId(null)}
                                >
                                    <Fade left>
                                        <Typography style={{
                                            margin: 0,
                                            lineHeight: '2',
                                            marginBottom: '10px',
                                            fontFamily: 'revert-layer',
                                            fontWeight: 700,
                                            fontSize: "1.2rem",
                                            textTransform: 'uppercase',
                                        }} onClick={() => handleNavMenuTitleClick(menu._id)}>
                                            {menu.title}
                                        </Typography>
                                    </Fade>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default Menus;
