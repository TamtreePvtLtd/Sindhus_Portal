import { Box, Container, Grid, Card, CardContent, Typography, useTheme, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetAllMenus, useGetFetchProductsByMenuId } from '../../customRQHooks/Hooks';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Fade from "react-reveal";

const OurMenus = () => {
    const { data: menus, isLoading: menusLoading, isError: menusError } = useGetAllMenus();
    const [selectedMenuId, setSelectedMenuId] = useState<null | string>(null);
    const theme = useTheme();
    const [hoveredMenuId, setHoveredMenuId] = useState<null | string>(null);

    const { data: productsData, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useGetFetchProductsByMenuId(
        selectedMenuId || ''
    );

    const handleMenuClick = (menuId: string) => {
        setSelectedMenuId(menuId);
    };

    useEffect(() => {
        // Fetch products when selectedMenuId changes
        if (selectedMenuId) {
            refetchProducts();
        }
    }, [selectedMenuId, refetchProducts]);

    const getMenuItemsInAlphabeticalOrder = () => {
        return menus ? [...menus].sort((a, b) => a.title.localeCompare(b.title)) : [];
    };

    useEffect(() => {
        // Find the ID of the "Appetizers" menu and set it as the initial selectedMenuId
        const appetizersMenuId = getMenuItemsInAlphabeticalOrder().find(menu => menu.title === 'Appetizers')?._id;
        setSelectedMenuId(appetizersMenuId || null);
    }, [menus]);

    return (
        <div>
            <Container>
                <Box sx={{ paddingTop: '40px' }}>
                    {menusLoading && <p>Loading menus...</p>}
                    {menusError && <p>Error fetching menus</p>}

                    {menus && (
                        <Grid container spacing={2} sx={{
                            display: 'flex', justifyContent: 'space-evenly'
                        }}>

                            {getMenuItemsInAlphabeticalOrder().map((menu,) => (
                                <Grid item key={menu._id} xs={12} sm={6} md={4} lg={2} >
                                    <Box
                                        sx={{
                                            marginTop: '5px',
                                            textAlign: 'center',
                                            padding: '5px',
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
                                        <Box>
                                            <Fade left>
                                                <Typography style={{
                                                    margin: 0,
                                                    lineHeight: '1',
                                                    marginBottom: '10px',
                                                    fontFamily: 'revert-layer',
                                                    fontWeight: 700,
                                                    fontSize: "1.2rem"
                                                }}>
                                                    {menu.title}
                                                </Typography>
                                            </Fade>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    <Divider sx={{ marginTop: '20px' }} />
                    {selectedMenuId && (
                        <Card sx={{ maxWidth: 700, margin: 'auto', boxShadow: 'none' }}>
                            <CardContent>
                                {/* Heading with the selected menu title */}
                                <Typography variant="h4" gutterBottom style={{ color: theme.palette.primary.main, fontFamily: '"Lucida Handwriting", cursive', fontWeight: "bold" }}>
                                    {menus?.find((m) => m._id === selectedMenuId)?.title}
                                </Typography>
                                {/* Display products for the selected menu */}
                                {productsLoading && <p>Loading products...</p>}
                                {productsError && <p>Error fetching products</p>}

                                {productsData && productsData.products && (
                                    <Grid container spacing={2}>
                                        {productsData.products.map((product) => (
                                            <Grid item key={product._id} xs={12} sm={12} md={12} lg={12}>
                                                <Fade left>
                                                    <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Grid item xs={8}>
                                                            <Box>
                                                                <Typography variant="h6">{product.title}</Typography>
                                                                <Typography>{product.description}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={1} sx={{ textAlign: 'center' }}>
                                                            <ArrowRightIcon sx={{ color: theme.palette.primary.main, }} />
                                                        </Grid>
                                                        <Grid item xs={3} style={{ textAlign: 'center' }}>
                                                            <Typography variant="h6">
                                                                {product.dailyMenuSizeWithPrice && product.dailyMenuSizeWithPrice.length > 0
                                                                    ? `$${product.dailyMenuSizeWithPrice[0].price.toFixed(2)}`
                                                                    : ''}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Fade>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                                <Divider sx={{ marginTop: '20px' }} />
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Container>
        </div>
    );
};

export default OurMenus;
