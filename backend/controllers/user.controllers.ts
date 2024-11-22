import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Restaurant, { IRestaurant } from "../models/restaurants.model.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3.js";
import Item, { IItem } from "../models/item.model.js";
import Category from "../models/Category.model.js";
import Cart, { ICart } from "../models/cart.model.js";
import CartItem from "../models/cartitem.model..js";
import { PopulatedItem } from "../types/express.js";

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { name, nickname, dateOfBirth, phoneNumber } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (nickname) {
      user.nickname = nickname;
    }

    if (dateOfBirth) {
      user.dateOfBirth = dateOfBirth;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    await user.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, password, confirmPassword } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json("Unauthorized");
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const isPasswordsMatch = bcrypt.compareSync(currentPassword, user.password);

    if (!isPasswordsMatch) {
      return res.status(400).json("Current password is incorrect");
    }

    if (password !== confirmPassword) {
      return res.status(403).json("Passwords do not match");
    }

    user.password = bcrypt.hashSync(password, 10);

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getRestaurantCuisines = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({});

    let cuisines: string[] = [];

    for (const restaurant of restaurants) {
      if (!cuisines.includes(restaurant.cuisine) && restaurant.cuisine) {
        cuisines.push(restaurant.cuisine);
      }
    }

    return res.status(200).json(cuisines);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getNewRestaurants = async (req: Request, res: Response) => {
  try {
    const timeline = new Date();
    timeline.setDate(timeline.getDate() - 30);

    const newRestaurants: IRestaurant[] = await Restaurant.find({
      isPublished: true,
      createdAt: { $gte: timeline },
    }).exec();

    for (const restaurant of newRestaurants) {
      const getObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: restaurant.coverImage,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      restaurant.imageUrl = url;

      await restaurant.save();
    }

    return res.status(200).json(newRestaurants);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const getObjectParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: restaurant.coverImage,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    restaurant.imageUrl = url;

    await restaurant.save();

    return res.status(200).json(restaurant);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getRestaurantItemsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const items = await Item.find({
      restaurantId: id,
      category,
    }).populate("category");

    for (const item of items) {
      const getObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: item.coverImage,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      item.imageUrl = url;

      await item.save();
    }

    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getRestaurantCategoriesById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const categories = await Category.find({
      restaurantId: restaurant.id,
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getRestaurantByCuisine = async (req: Request, res: Response) => {
  try {
    const { cuisine } = req.body;

    const restaurants = await Restaurant.find({
      cuisine,
    });

    if (!restaurants) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    for (const restaurant of restaurants) {
      const getObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: restaurant.coverImage,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      restaurant.imageUrl = url;
    }

    return res.status(200).json(restaurants);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.body;

    const userId = req.userId;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const cart: ICart | null = await Cart.findOne({
      restaurantId: item?.restaurantId,
      userId,
    });

    if (!cart) {
      const newCart = await Cart.create({
        userId,
        restaurantId: item.restaurantId,
      });

      await User.findByIdAndUpdate(userId, {
        $push: {
          cartId: newCart._id,
        },
      });

      const cartItem = await CartItem.findOne({
        cartId: newCart?._id,
        itemId: item._id,
      });

      if (cartItem) {
        await Cart.findByIdAndUpdate(newCart?._id, {
          $pull: {
            cartItems: cartItem?._id,
          },
        });

        await CartItem.findByIdAndDelete(cartItem?._id);
      } else {
        const newCartItem = await CartItem.create({
          cartId: newCart?._id,
          userId,
          itemId: item._id,
          price: item.price,
          quantity: 1,
        });

        await Cart.findByIdAndUpdate(newCart?._id, {
          $push: {
            cartItems: newCartItem._id,
          },
        });
      }
    } else {
      const cartItem = await CartItem.findOne({
        cartId: cart?._id,
        itemId: item._id,
      });

      if (cartItem) {
        await Cart.findByIdAndUpdate(cart?._id, {
          $pull: {
            cartItems: cartItem?._id,
          },
        });

        await CartItem.findByIdAndDelete(cartItem?._id);

        const updatedCart = await Cart.findById(cart?._id);

        if (updatedCart?.cartItems.length === 0) {
          await Cart.findByIdAndDelete(cart?._id);
          await User.findByIdAndUpdate(userId, {
            $pull: { cartId: cart?._id },
          });
        }
      } else {
        const newCartItem = await CartItem.create({
          cartId: cart?._id,
          userId,
          itemId: item._id,
          price: item.price,
          quantity: 1,
        });

        await Cart.findByIdAndUpdate(cart?._id, {
          $push: {
            cartItems: newCartItem._id,
          },
        });
      }
    }

    return res.status(200).json({ message: "Cart is updated." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({
      isPublished: true,
    });

    for (const restaurant of restaurants) {
      const getObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: restaurant.coverImage,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      restaurant.imageUrl = url;
      await restaurant.save();
    }

    return res.status(200).json(restaurants);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getUserCarts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const userCarts = await Cart.find({
      userId,
    }).populate("restaurantId");

    const userCartsRestaurant: IRestaurant[] = userCarts.map((cart) => {
      return cart.restaurantId as unknown as IRestaurant;
    });

    for (const restaurant of userCartsRestaurant) {
      const getObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: restaurant.coverImage,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

      restaurant.imageUrl = url;
      await restaurant.save();
    }

    return res.status(200).json(userCarts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getUserCartItems = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id: cartId } = req.params;

    const userCart = await Cart.findOne({
      _id: cartId,
      userId,
    }).populate<{ restaurantId: IRestaurant }>("restaurantId");

    const restaurantName = userCart?.restaurantId?.name;
    const restaurantId = userCart?.restaurantId?._id;

    const isRestaurantClosed = userCart?.restaurantId?.isClosed;
    const isRestaurantTimeout = userCart?.restaurantId?.isTimeout;

    const cartItems = await CartItem.find({
      cartId: userCart?._id,
      userId,
    })
      .populate<{ itemId: PopulatedItem }>("itemId")
      .populate({
        path: "itemId",
        populate: {
          path: "restaurantId",
        },
      });

    if (cartItems) {
      for (const item of cartItems) {
        const getObjectParams = {
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: item.itemId.coverImage,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        item.itemId.imageUrl = url;
        await item.save();
      }
    }

    return res.status(200).json({
      cartItems,
      restaurantName,
      isRestaurantClosed,
      isRestaurantTimeout,
      restaurantId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const changeCartItemQuantity = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({
      cartId: cart._id,
      itemId,
      userId,
    }).populate("itemId");

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity > 0) {
      await CartItem.findByIdAndUpdate(cartItem._id, {
        quantity,
      });
    }

    return res.status(200).json("Cart item quantity updated");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getSearchResults = async (req: Request, res: Response) => {
  try {
    const { search } = req.body;

    let restaurants: IRestaurant[] = [];
    let items: IItem[] = [];

    if (search) {
      restaurants = await Restaurant.find({
        $or: [{ name: { $regex: search, $options: "i" } }],
        isPublished: true,
      });

      items = await Item.find({
        $or: [{ name: { $regex: search, $options: "i" } }],
      }).populate("restaurantId");
    }

    return res.status(200).json({ restaurants, items });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const addCartItemNote = async (req: Request, res: Response) => {
  try {
    const { note, cartItemId } = req.body;

    if (!note || !cartItemId) {
      return res
        .status(404)
        .json({ message: `${!note ? "Note" : "Cart Item id"} is missing` });
    }

    await CartItem.findByIdAndUpdate(
      cartItemId,
      { $set: { note } },
      { new: true }
    );

    return res.status(201).json("Cart item note added");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const removeCartItemNote = async (req: Request, res: Response) => {
  try {
    const { cartItemId } = req.body;

    if (!cartItemId) {
      return res.status(404).json({ message: "Cart Item id is missing" });
    }

    await CartItem.findByIdAndUpdate(
      cartItemId,
      {
        $set: { note: null },
      },
      { new: true }
    );

    return res.status(201).json("Cart item note added");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getOnSaleProducts = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({
      isPublished: true,
      isOnSale: true,
    });

    return res.status(200).json(restaurants);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});

    return res.status(200).json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getCategoryItems = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;

    const items = await Item.find({ category: categoryId }).populate(
      "restaurantId"
    );

    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};
