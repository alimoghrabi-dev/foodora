import axios from "axios";

export const getMenuItems = async (token: string | null) => {
  try {
    const response = await axios.get("/restaurant/get-items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    return resData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const addNewItem = async (
  data: {
    name: string;
    price: number;
    description: string;
    image: File;
    category: string;
  },
  token: string | null
) => {
  try {
    const { name, description, price, image, category } = data;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("image", image);
    formData.append("category", category);

    const response = await axios.post("/restaurant/add-item", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    return resData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const createNewCategory = async (name: string, token: string | null) => {
  try {
    const response = await axios.post(
      "/restaurant/create-category",
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = response.data;

    if (response.status !== 201) {
      throw new Error(resData);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getRestaurantCategories = async (token: string | null) => {
  try {
    const response = await axios.get("/restaurant/get-categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    return resData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getItemById = async (
  itemId: string | undefined,
  token: string | null
) => {
  try {
    const response = await axios.post(
      "/restaurant/get-item",
      {
        itemId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = response.data;

    return resData;
  } catch (error) {
    console.log(error);
  }
};

export const editItem = async (
  data: {
    name?: string | undefined;
    price?: number | undefined;
    description?: string | undefined;
    image?: File | undefined;
    category?: string | undefined;
    isOutOfStock?: boolean;
  },
  itemId: string,
  token: string | null
) => {
  try {
    const { name, description, price, image, category, isOutOfStock } = data;

    const formData = new FormData();

    formData.append("name", name || "");
    formData.append("price", String(price || 0));
    formData.append("description", description || "");
    formData.append("image", image || "");
    formData.append("category", category || "");
    formData.append("isOutOfStock", isOutOfStock);

    const response = await axios.put(
      `/restaurant/edit-item/${itemId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const completeStoreInfo = async (
  data: {
    deliveryTime?: string | undefined;
    cuisine?: string | undefined;
    description?: string | undefined;
    phoneNumber?: string | undefined;
    address?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    coverImage?: File | undefined;
  },
  token: string | null
) => {
  try {
    const {
      deliveryTime,
      cuisine,
      description,
      phoneNumber,
      address,
      latitude,
      longitude,
      coverImage,
    } = data;

    const formData = new FormData();

    formData.append("deliveryTime", deliveryTime || "");
    formData.append("cuisine", cuisine || "");
    formData.append("description", description || "");
    formData.append("image", coverImage || "");
    formData.append("phoneNumber", phoneNumber || "");
    formData.append("address", address || "");
    formData.append("latitude", String(latitude || 0));
    formData.append("longitude", String(longitude || 0));

    const response = await axios.put(`/restaurant/complete-info`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const renderImageUrl = async (token: string | null) => {
  try {
    const response = await axios.get("/restaurant/render-image", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    return resData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getVerificationToken = async (token: string | null) => {
  try {
    const response = await axios.get("/restaurant/email-link", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    if (response.status !== 200) {
      throw new Error(resData);
    }

    return resData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const verifyEmail = async (token: string | null) => {
  try {
    const response = await axios.get("/restaurant/verify-email", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    if (response.status !== 200) {
      throw new Error(resData || "Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const publishStore = async (token: string | null) => {
  try {
    const response = await axios.put(
      "/restaurant/publish",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = response.data;

    if (response.status !== 200) {
      throw new Error(resData || "Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const applyDiscount = async (
  token: string | null,
  percentage: number | null
) => {
  try {
    const response = await axios.put(
      "/restaurant/apply-discount",
      {
        percentage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = response.data;

    if (response.status !== 200) {
      throw new Error(resData || "Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const removeDiscount = async (token: string | null) => {
  try {
    const response = await axios.put(
      "/restaurant/remove-discount",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = response.data;

    if (response.status !== 200) {
      throw new Error(resData || "Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const editRestaurantInfo = async (
  data: {
    deliveryTime?: string | undefined;
    cuisine?: string | undefined;
    description?: string | undefined;
    phoneNumber?: string | undefined;
    coverImage?: File | undefined;
  },
  token: string | null
) => {
  try {
    const { deliveryTime, cuisine, description, phoneNumber, coverImage } =
      data;

    const formData = new FormData();

    formData.append("deliveryTime", deliveryTime || "");
    formData.append("cuisine", cuisine || "");
    formData.append("description", description || "");
    formData.append("image", coverImage || "");
    formData.append("phoneNumber", phoneNumber || "");

    const response = await axios.put(`/restaurant/edit-info`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getRestaurantOrders = async (token: string | null) => {
  try {
    const response = await axios.get(`/restaurant/get-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getOrderById = async (
  token: string | null,
  orderId: string | undefined
) => {
  try {
    const response = await axios.post(
      `/restaurant/get-order-by-id`,
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const acceptAndReadyOrder = async (
  token: string | null,
  orderId: string | undefined
) => {
  try {
    const response = await axios.put(
      `/restaurant/accept-ready-order`,
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 201) {
      throw new Error(data || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const toggleRestaurant = async (token: string | null) => {
  try {
    const response = await axios.put(
      `/restaurant/toggle-restaurant`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data || "Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const editRestaurantHours = async (
  token: string | null,
  openingHours: IOpeningHours | undefined
) => {
  try {
    const response = await axios.put(
      `/restaurant/restaurant-hours`,
      { openingHours },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status !== 200) {
      throw new Error(data || "Something went wrong");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Something went wrong");
    } else {
      throw new Error("Something went wrong");
    }
  }
};
