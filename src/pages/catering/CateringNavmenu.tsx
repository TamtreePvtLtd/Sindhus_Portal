import { Box, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useGetAllMenus } from '../../customRQHooks/Hooks';
import Fade from "react-reveal";

interface MenusProps {
    onSelectMenu: (menuId: string) => void;
    onNavMenuTitleClick: (menuId: string) => void;
    selectedMenuId: string; // Added prop to sync with selected menu in SearchBar
}

const Menus = ({ onSelectMenu, onNavMenuTitleClick, selectedMenuId }: MenusProps) => {
    const { data: menus, isLoading: menusLoading, isError: menusError } = useGetAllMenus();
    const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
    const [selectedMenuIdState, setSelectedMenuIdState] = useState<string>("");

    useEffect(() => {
        // When the selectedMenuId changes, update hoveredMenuId to reflect the same menu
        setHoveredMenuId(selectedMenuId);
        setSelectedMenuIdState(selectedMenuId); // Ensure the selected menu is active when provided
    }, [selectedMenuId]);

    const getMenuItemsInAlphabeticalOrder = () => {
        return menus ? [...menus].sort((a, b) => a.title.localeCompare(b.title)) : [];
    };

    useEffect(() => {
        // If selectedMenuId is not provided, set the initial selectedMenuIdState to the ID of the "Appetizers" menu
        if (!selectedMenuId) {
            const appetizersMenuId = getMenuItemsInAlphabeticalOrder().find(menu => menu.title === 'Appetizers')?._id;
            setSelectedMenuIdState(appetizersMenuId || "");
        }
    }, [selectedMenuId]);

    const handleMenuClick = (menuId: string) => {
        onSelectMenu(menuId);
        setSelectedMenuIdState(menuId);
    };

    const handleNavMenuTitleClick = (menuId: string) => {
        onNavMenuTitleClick(menuId);
        setSelectedMenuIdState(menuId);
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
                                        color: (selectedMenuIdState === menu._id || hoveredMenuId === menu._id) ? 'text.primary' : 'text.disabled',
                                        textDecoration: (selectedMenuIdState === menu._id || hoveredMenuId === menu._id) ? 'underline' : 'none',
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
                                        }}  onClick={() => {
                                            handleNavMenuTitleClick(menu._id);
                                            onSelectMenu(menu._id); // This line ensures that the selected menu in the dropdown matches the active menu in the nav menu
                                        }}>
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
