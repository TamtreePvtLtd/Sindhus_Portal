import { useMutation, useQuery } from "@tanstack/react-query";
import {
  cateringfetchProductData,
  getAllMenus,
  getAllDiningOutMenuDatas,
  getAllDiningOutProducts,
  getfetchProductsByMenuId,
  getAllSnacksProductsWithSubMenu,
  fetchProductByCateringMenu,
  getAllDailyMenus,
  getAllSpecials,
  getMenuType3,
  getAllMenusInCatering,
  getAllCoupens,
  getDistanceBasedDeliveryCharge,
  getNearestGreaterDistance,
  createPaymentIntent,
  getLastTransaction,
  createCartItem,
  createShipment,
} from "../services/api";
import { queryClient } from "../App";


export const useGetAllMenus = () => {
  return useQuery({
    queryKey: ["menus"],
    queryFn: getAllMenus,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useGetAllMenusInCatering = () => {
  return useQuery({
    queryKey: ["menu"],
    queryFn: getAllMenusInCatering,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useCateringfetchProductData = (menuId: string, term: string) => {
  return useQuery({
    queryKey: ["fetchProducts"],
    queryFn: () => cateringfetchProductData(menuId, term),
    refetchOnWindowFocus: false,
  });
};

export const useGetAllDiningOutMenuDatas = () => {
  return useQuery({
    queryKey: ["diningOutMenuDatas"],
    queryFn: getAllDiningOutMenuDatas,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useGetAllDiningOutProducts = () => {
  return useQuery({
    queryKey: ["diningOutProduct"],
    queryFn: getAllDiningOutProducts,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useGetFetchProductsByMenuId = (menuId: string) => {
  return useQuery({
    queryKey: ["fetchProductsByMenuId", menuId],
    queryFn: () => getfetchProductsByMenuId(menuId),
    refetchOnWindowFocus: false,
  });
};

export const useGetSnacksProductsBySubMenuId = (subMenuId: string) => {
  return useQuery({
    queryKey: ["fetchSnacksProductsBySubMenuId"],
    queryFn: () => getAllSnacksProductsWithSubMenu(subMenuId),
    refetchOnWindowFocus: false,
  });
};

export const useGetProductByCateringMenu = (
  selectedMenuId: string,
  selectedProductId: string,
  page: number
) => {
  return useQuery({
    queryKey: ["productsByPagination"],
    queryFn: () =>
      fetchProductByCateringMenu(selectedMenuId, selectedProductId, page),
    refetchOnWindowFocus: false,
  });
};

export const useGetAllDailyMenus = () => {
  return useQuery({
    queryKey: ["dailyMenus"],
    queryFn: getAllDailyMenus,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
export const usegetAllSpecials = () => {
  return useQuery({
    queryKey: ["specials"],
    queryFn: getAllSpecials,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useGetAllMenuType3 = (menuId: string) => {
  return useQuery(["products", menuId], () => getMenuType3(menuId), {
    refetchOnWindowFocus: false,
  });
};

export const useGetAllCoupens = () => {
  return useQuery({
    queryKey: ["coupens"],
    queryFn: getAllCoupens,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: false, // Disable fetching on component mount
  });
};

export const useGetDistanceBasedDeliveryCharge = () => {
  return useQuery({
    queryKey: ["distance"],
    queryFn: () => getDistanceBasedDeliveryCharge(),
    refetchOnWindowFocus: false,
  });
};

export const useGetNearestGreaterDistance = (distance: string) => {
  return useQuery({
    queryKey: ["distance", distance], // Include distance in the query key
    queryFn: () => getNearestGreaterDistance(distance), // Corrected function name
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    enabled: !!distance, // Ensure the query runs only when distance is available
  });
};

export const useGetLastTransaction = () => {
  return useQuery({
    queryKey: ["transaction"], // Include distance in the query key
    queryFn: () => getLastTransaction()
    , // Corrected function name
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    enabled: false, // Disable fetching on component mount

  });
};


export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useCreateCartItem = () => {
  return useMutation({
    mutationFn: createCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItem"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
