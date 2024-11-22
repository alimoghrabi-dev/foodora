import axios from "axios";

export const checkIfEmailAlreadyInUse = async (email: string) => {
  try {
    const response = await axios.post("/auth/email-check", {
      email,
    });

    const responseData = response.data;

    if (response.status === 404) {
      throw new Error(responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const signupUser = async (params: {
  name: string;
  nickname?: string | undefined;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const { name, nickname, email, phoneNumber, password, confirmPassword } =
      params;

    const response = await axios.post("/auth/sign-up", {
      name,
      nickname,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });

    const responseData = response.data;

    if (!response) {
      throw new Error(responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const editUserProfile = async (
  params: {
    name?: string | undefined;
    nickname?: string | undefined;
    dateOfBirth?: string | undefined;
    phoneNumber?: string | undefined;
  },
  token: string | null
) => {
  try {
    const { name, nickname, dateOfBirth, phoneNumber } = params;

    const response = await axios.put(
      "/user/edit-profile",
      {
        name,
        nickname,
        dateOfBirth,
        phoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = response.data;

    if (!response) {
      throw new Error(responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const changePassword = async (
  params: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  },
  token: string | null
) => {
  try {
    const { currentPassword, password, confirmPassword } = params;

    const response = await axios.put(
      "/user/change-password",
      {
        currentPassword,
        password,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const createApply = async (params: {
  restaurantName: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
}) => {
  try {
    const { restaurantName, description, email, phoneNumber, address } = params;

    await axios.post("/apply/create", {
      restaurantName,
      description,
      email,
      phoneNumber,
      address,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getAllApplies = async (token: string | null) => {
  try {
    const response = await axios.get("/apply/get-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const rejectOrApproveApply = async (
  applyId: string,
  token: string | null
) => {
  try {
    const response = await axios.put(
      "/apply/reject-approve",
      {
        applyId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const registerationRestaurantStatus = async (token: string | null) => {
  try {
    const response = await axios.get("/auth/generate-registration-status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const createNewRestaurant = async (
  params: {
    restaurantName: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  },
  token: string | null
) => {
  const { restaurantName, phoneNumber, password, confirmPassword } = params;

  try {
    const response = await axios.post(
      "/restaurant/register",
      {
        restaurantName,
        phoneNumber,
        password,
        confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getRestaurantCuisines = async () => {
  try {
    const response = await axios.get("/user/get-cuisines");

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getNewRestaurants = async () => {
  try {
    const response = await axios.get("/user/new-restaurants");

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRestaurantById = async (
  id: string | undefined,
  token: string | null
) => {
  try {
    const response = await axios.get(`/user/get-restaurant-by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRestaurantItems = async (
  id: string | undefined,
  category: string | undefined,
  token: string | null
) => {
  try {
    const response = await axios.post(
      `/user/get-restaurant-items/${id}`,
      {
        category,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRestaurantCategories = async (
  id: string | undefined,
  token: string | null
) => {
  try {
    const response = await axios.get(`/user/get-restaurant-categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRestaurantByCuisine = async (cuisine: string | null) => {
  try {
    const response = await axios.post("/user/get-restaurant-by-cuisine", {
      cuisine,
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addAndRemoveItemFromCart = async (
  itemId: string,
  token: string | null
) => {
  try {
    const response = await axios.post(
      "/user/add-item-to-cart",
      {
        itemId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllRestaurants = async () => {
  try {
    const response = await axios.get("/user/get-all-restaurants");

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserCartItems = async (
  token: string | null,
  cartId: string | undefined
) => {
  try {
    const response = await axios.get(`/user/get-user-cart-items/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const changeCartItemQuantity = async (
  itemId: string,
  token: string | null,
  quantity: number
) => {
  try {
    const response = await axios.put(
      "/user/change-quantity",
      {
        itemId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSearchResults = async (search: string | null) => {
  try {
    const response = await axios.post("/user/search-results", {
      search,
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserCarts = async (token: string | null) => {
  try {
    const response = await axios.get("/user/get-user-carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addCartItemNote = async (
  token: string | null,
  note: string | null,
  cartItemId: string | undefined
) => {
  try {
    const response = await axios.put(
      "/user/add-note",
      {
        note,
        cartItemId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 201) {
      throw new Error(data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeCartItemNote = async (
  token: string | null,
  cartItemId: string | undefined
) => {
  try {
    const response = await axios.put(
      "/user/remove-note",
      {
        cartItemId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 201) {
      throw new Error(data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOnSaleRestaurants = async () => {
  try {
    const response = await axios.get("/user/get-on-sale-restaurants");

    const data = response.data;

    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createNewOrder = async (
  token: string | null,
  restaurantId: string | undefined,
  cartId: string | undefined,
  checkoutType: string,
  totalPrice: number
) => {
  try {
    const response = await axios.post(
      "/order/create-order",
      {
        restaurantId,
        cartId,
        checkoutType,
        totalPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 201) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getActiveOrders = async (token: string | null) => {
  try {
    const response = await axios.get("/order/active-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPastOrders = async (token: string | null) => {
  try {
    const response = await axios.get("/order/past-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get("/user/get-all-categories");

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCategoryItems = async (categoryId: string | undefined) => {
  try {
    const response = await axios.get(`/user/get-category-items/${categoryId}`);

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createDriverApply = async (params: {
  driverName: string;
  email: string;
  phoneNumber: string;
  address: string;
  licenseNumber: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseType: string;
}) => {
  try {
    const {
      driverName,
      email,
      phoneNumber,
      address,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      licenseType,
    } = params;

    await axios.post("/driver/apply", {
      name: driverName,
      email,
      phoneNumber,
      address,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      licenseType,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};
