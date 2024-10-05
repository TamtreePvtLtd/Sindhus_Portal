import {
  ICateringEnquiry,
  ICateringMenu,
  ISelectedCateringProduct,
  ISnacksPage,
  ICategory,
  ICategoryWithProducts,
  ICommonResponse,
  IMenuDatas,
  IMenuList,
  IProduct,
  IProductDropDownData,
  PaginationInfo,
  ISpecials,
  IMenuDatastype,
  menuWithProduct,
  ICoupenResponse,
  DistanceBasedDeliveryCharge,
  PaymentData,
} from "./../interface/types";
import { httpWithoutCredentials } from "./http";

const getAllMenus = async () => {
  try {
    const response = await httpWithoutCredentials.get<IMenuList[]>(
      "/menu/getAllMenus"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllMenusInCatering = async () => {
  console.log("hi");
  try {
    const response = await httpWithoutCredentials.get<IMenuList[]>(
      "/menu/getAllMenusInCatering"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllSpecials = async () => {
  try {
    const response = await httpWithoutCredentials.get<ISpecials>(
      "/specials/getAllSpecials"
    );
    // console.log("response",response.data.data)
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
const cateringfetchProductData = async (
  menuId: string = "",
  searchTerm: string = ""
) => {
  try {
    let cateringPageProduct = `/product/searchProduct`;

    if (menuId) {
      cateringPageProduct += `/${menuId}`;
    }
    if (!searchTerm && !menuId) {
      return [];
    }

    if (searchTerm) {
      cateringPageProduct += `?searchTerm=${searchTerm}`;
    }

    const response = await httpWithoutCredentials.get<IProductDropDownData[]>(
      cateringPageProduct
    );
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

const fetchProductById = async (productId: string | undefined) => {
  try {
    const response = await httpWithoutCredentials.get<
      ICommonResponse<IProduct>
    >(`product/fetchProductById/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const getAllDiningOutMenuDatas = async () => {
  try {
    const response = await httpWithoutCredentials.get<ICategory[]>(
      "diningOut/getAllDiningOutMenuDatas"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCateringEnquiry = async (data: ICateringEnquiry) => {
  try {
    const response = await httpWithoutCredentials.post(
      "enquiry/createEnquiry",
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllDiningOutProducts = async () => {
  try {
    const response = await httpWithoutCredentials.get<ICategoryWithProducts[]>(
      "/diningOut/getAllDiningOutProducts"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getfetchProductsByMenuId = async (menuId: string) => {
  try {
    const response = await httpWithoutCredentials.get<IMenuDatas>(
      `diningOut/fetchProductsByMenuId/${menuId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProductsByMenuIdWithSearchTerm = async (
  selectedMenuId: string = "",
  searchTerm: string = ""
) => {
  try {
    let homePageProduct = `/diningOut/searchDiningOutProduct`;

    if (selectedMenuId) {
      homePageProduct += `/${selectedMenuId}`;
    }
    if (!searchTerm && !selectedMenuId) {
      return [];
    }

    if (searchTerm && searchTerm.length >= 1) {
      homePageProduct += `?searchTerm=${searchTerm}`;
    }
    const response = await httpWithoutCredentials.get<IProductDropDownData[]>(
      homePageProduct
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const getAllSnacksProductsWithSubMenu = async (subMenuId: string) => {
  try {
    if (subMenuId) {
      subMenuId = `/${subMenuId}`;
    }
    const response = await httpWithoutCredentials.get<ISnacksPage>(
      `/product/getAllSnacksMenu${subMenuId}`
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const fetchProductByCateringMenu = async (
  menuId?: string,
  productId?: string,
  page?: number
) => {
  try {
    var cateringMenus = "/product/fetchProductsByCateringMenu";

    const response = await httpWithoutCredentials.get<
      PaginationInfo<ICateringMenu>
    >(cateringMenus, {
      params: {
        page,
        menuId,
        productId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const getCateringBag = async (selectedProductIds: string[]) => {
  try {
    const response = await httpWithoutCredentials.post<
      ISelectedCateringProduct[]
    >("product/getCateringBag", selectedProductIds);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const sendCateringRequest = async (userData, combinedProducts) => {
  try {
    const response = await httpWithoutCredentials.post(
      "cateringUser/createCateringUser",
      { userData, combinedProducts }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllDailyMenus = async () => {
  try {
    const response = await httpWithoutCredentials.get<IMenuList[]>(
      "/diningOut/getDiningOutMenus"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getMenuType3 = async (menuId?: string) => {
  try {
    const response = await httpWithoutCredentials.get<menuWithProduct>(
      `/menu/getMenuType3?${menuId ? `menuId=${menuId}` : ""}`
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllCoupens = async () => {
  try {
    const response = await httpWithoutCredentials.get<ICoupenResponse>(
      "/coupen/getAllCoupens"
    );

    return response.data;
  } catch (error) {
    var message = (error as Error).message;
    throw new Error(message);
  }
};
const getDistanceBasedDeliveryCharge = async () => {
  try {
    const response = await httpWithoutCredentials.get<
      DistanceBasedDeliveryCharge[]
    >("/distance/getAllDistances");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getNearestGreaterDistance = async (distance: string) => {
  try {
    const response =
      await httpWithoutCredentials.get<DistanceBasedDeliveryCharge>(
        `/distance/getNearestDistance/${distance}`
      );
    return response.data; // Extract only the relevant data from the response
  } catch (error) {
    throw error;
  }
};

const getLastTransaction = async () => {
  try {
    const response = await httpWithoutCredentials.get<string>(
      `/payment/lasttransaction`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCartItem = async (formData) => {
  try {
    const response = await httpWithoutCredentials.post<string[]>(
      "/cart/cartItem",
      formData
    );
    console.log("response", response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const createPaymentIntent = async (formData) => {
  try {
    const response = await httpWithoutCredentials.post(
      "/payment/createPaymentIntent",
      formData
    );

    console.log("response", response.data);

    return {
      clientSecret: response.data.clientSecret,
      message: response.data.message,
      orderNumber: response.data.orderNumber,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export {
  createCartItem,
  getLastTransaction,
  createPaymentIntent,
  getNearestGreaterDistance,
  getDistanceBasedDeliveryCharge,
  getAllMenus,
  fetchProductById,
  cateringfetchProductData,
  getAllDiningOutMenuDatas,
  getAllDiningOutProducts,
  getfetchProductsByMenuId,
  createCateringEnquiry,
  getProductsByMenuIdWithSearchTerm,
  getAllSnacksProductsWithSubMenu,
  fetchProductByCateringMenu,
  getCateringBag,
  sendCateringRequest,
  getAllDailyMenus,
  getAllSpecials,
  getMenuType3,
  getAllMenusInCatering,
  getAllCoupens,
};
